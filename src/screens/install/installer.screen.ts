import path from 'path';
import  prompt  from 'electron-prompt';
import { InstallStore } from './install.store';
import { exec as nodeExec } from 'child_process';
import { BrowserWindow, dialog,App } from 'electron';
import { DNSMASQ_INFO, INSTALL_SCRIPT, IPC_CHANNEL } from '../../constants';

export class InstallerScreen {
  public static app : App;
  public static store: InstallStore;
  public static mainWindow: BrowserWindow;
  public static browserWindow: typeof BrowserWindow;


  public static onClose(): void {
    this.mainWindow = null;
  }

  public static createScreen(): void {
    this.mainWindow = new BrowserWindow({
      show: false,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    this.mainWindow.on('closed', () => this.onClose());
  }

  public static loadView(): void {
    this.mainWindow
      .loadFile(path.join(__dirname, 'install.view.html'))
      .catch((ex) => console.log(ex));
  }

  public static onceShow(handler: (...args: any[]) => any): void {
    this.mainWindow.once('show', () =>
      this.setup()
        .then(handler)
        .catch((ex) => console.error(ex))
    );
  }
  public static show(): void {
    this.mainWindow.show();
  }

  public static hide(): void {
    this.mainWindow.hide();
  }

  public static close(): void {
    this.mainWindow.close();
  }

  public static installPackage(resolve,reject,password) {

    const installProcess =  nodeExec( INSTALL_SCRIPT(password),(error) => {
      if (error) {
        InstallerScreen.store.unmarkInstall();
        reject(error);
      }
    });

    installProcess.stdout.on('data', (logs) => {
      InstallerScreen.mainWindow.webContents.send(
          IPC_CHANNEL.DNSMASQ_INSTALL_STDOUT,
          logs
      );
    });

    installProcess.on('exit', () =>{
      resolve(true)
    })

  }

  public static setup(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      nodeExec(DNSMASQ_INFO, (error, stdout) => {
        if (error) {
          InstallerScreen.mainWindow.webContents.send(
            IPC_CHANNEL.DNSMASQ_INSTALL_STDOUT,
            stdout
          );

          prompt({
            title: 'Required auth for sudo command',
            label: 'Auth required',
            inputAttrs: {
              type: 'text'
            },
            type:"input"
          }).then(password => {

            if(password) {
              InstallerScreen.installPackage(resolve,reject,password);
            }else {
              dialog.showErrorBox('Auth error','Wrong password !');
              InstallerScreen.app.quit();
            }
          }).catch(ex => {
            InstallerScreen.mainWindow.webContents.send(
                IPC_CHANNEL.DNSMASQ_INSTALL_STDOUT,
                JSON.stringify(ex,undefined,2)
            );
            dialog.showErrorBox('Auth error','Wrong password !');
            InstallerScreen.app.quit();
          })

        } else {
          InstallerScreen.store.markInstall();
          resolve(true);
        }
      });
    });
  }

  public static main(
    app: App,
    store: InstallStore,
    browserWindow: typeof BrowserWindow
  ): void {
    this.store = store;
    this.browserWindow = browserWindow;
  }
}
