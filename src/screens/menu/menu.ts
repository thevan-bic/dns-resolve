import { App, ipcMain, Menu, BrowserWindow } from 'electron';
import { MainScreen } from '../main';

export class DNSResolveMenu {
  private readonly menu: Menu;

  public constructor(app: App) {
    const isMac = process.platform === 'darwin';
    const template = [
      {
        label: 'App',
        submenu: [isMac ? { role: 'close' } : { role: 'quit' }]
      }
    ];
    this.menu = Menu.buildFromTemplate(template as any);

    Menu.setApplicationMenu(this.menu);

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  public handleMenu(browserWindow: BrowserWindow): void {
    ipcMain.on(`display-app-menu`, (e, args) => {
      if (browserWindow) {
        this.menu.popup({
          window: MainScreen.mainWindow,
          x: args.x,
          y: args.y
        });
      }
    });

    ipcMain.on(`minimizeWindow`, (e, args) => {
      browserWindow.minimize();
    });

    ipcMain.on(`closeWindow`, (e, args) => {
      browserWindow.close();
    });
  }
}
