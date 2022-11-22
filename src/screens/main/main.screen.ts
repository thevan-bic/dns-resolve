import path from 'path';
import { DNSConfig } from '../../types';
import { MainStore } from './main.store';
import { IPC_CHANNEL } from '../../constants';
import { BrowserWindow, App, ipcMain } from 'electron';

export class MainScreen {
  public static application: App;
  public static store: MainStore;
  public static mainWindow: BrowserWindow;
  public static browserWindow: typeof BrowserWindow;
  public static onDataChane: (data: DNSConfig[]) => void;
  public static onViewEvent: {
    start: (...args: unknown[]) => unknown;
    stop: (...args: unknown[]) => unknown;
    restart: (...args: unknown[]) => unknown;
    reload: (...args: unknown[]) => unknown;
    enable: (...args: unknown[]) => unknown;
    resolvSet: (...args: unknown[]) => unknown;
    resolvReset: (...args: unknown[]) => unknown;
  };

  public static onWindowAllClosed(): void {
    if (process.platform !== 'darwin') {
      this.application.quit();
    }
  }

  public static onClose(): void {
    // Dereference the window object.
    this.mainWindow = null;
  }

  public static registerHandleIPCEvents(
    channel: string,
    handler: (data: unknown) => void
  ): void {
    ipcMain.on(channel, (_, data: unknown) => handler(data));
  }

  public static createScreen(): void {
    this.mainWindow = new BrowserWindow({
      show: false,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, '../../preload.js'),
        nodeIntegration: true,
        contextIsolation: false
      },
      width: 800,
      height: 600,
      maxHeight: 600,
      maxWidth: 800,
      icon: path.join(__dirname, '../../../assets/logo.ico')
    });

    this.registerHandleIPCEvents(
      IPC_CHANNEL.DNSMASQ_CONFIG_CHANGED,
      (data: DNSConfig[]) => {
        this.store.saveConfig(data);
        this.onDataChane(data);
      }
    );

    this.registerHandleIPCEvents(IPC_CHANNEL.DNSMASQ_ENABLE, () =>
      MainScreen.onViewEvent.enable()
    );
    this.registerHandleIPCEvents(IPC_CHANNEL.DNSMASQ_RELOAD, () =>
      MainScreen.onViewEvent.reload()
    );
    this.registerHandleIPCEvents(IPC_CHANNEL.DNSMASQ_RESTART, () =>
      MainScreen.onViewEvent.restart()
    );

    this.registerHandleIPCEvents(IPC_CHANNEL.DNSMASQ_START, () =>
      MainScreen.onViewEvent.start()
    );
    this.registerHandleIPCEvents(IPC_CHANNEL.DNSMASQ_STOP, () =>
      MainScreen.onViewEvent.stop()
    );

    this.registerHandleIPCEvents(IPC_CHANNEL.RESOLV_SET, () =>
      MainScreen.onViewEvent.resolvSet()
    );
    this.registerHandleIPCEvents(IPC_CHANNEL.RESOLV_RESET, () =>
      MainScreen.onViewEvent.resolvReset()
    );

    this.mainWindow
      .loadFile(path.join(__dirname, 'main.view.html'))
      .catch((ex) => console.log(ex));

    this.mainWindow.on('closed', () => this.onClose());
  }

  public static show(): void {
    this.mainWindow.show();
  }

  public static loadData(): void {
    this.mainWindow.webContents.on('did-finish-load', async () => {
      const config = this.store.getConfig();
      this.mainWindow.webContents.send(IPC_CHANNEL.DNSMASQ_LOAD_CONFIG, config);
    });
  }

  public static hide(): void {
    this.mainWindow.hide();
  }

  public static main(
    app: App,
    store: MainStore,
    browserWindow: typeof BrowserWindow
  ): void {
    this.store = store;
    this.application = app;
    this.browserWindow = browserWindow;
  }
}
