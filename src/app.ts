import { DNSResolveMenu } from './screens/menu';
import { DnsmasqHandler } from './services/dns';
import { app, dialog, BrowserWindow } from 'electron';
import { MainScreen, MainStore } from './screens/main';
import { InstallerScreen, InstallStore } from './screens/install';

const mainStore = new MainStore();
const installStore = new InstallStore();
const dnsmasqHandler = new DnsmasqHandler();
const menu = new DNSResolveMenu(app);
InstallerScreen.main(app,installStore, BrowserWindow);
MainScreen.main(app, mainStore, BrowserWindow);

app.on('ready', () => {
  MainScreen.createScreen();
  menu.handleMenu(MainScreen.mainWindow);

  MainScreen.onDataChane = async (data) => {
    dnsmasqHandler
      .saveConfig(data)
      .then(() =>
        dialog.showMessageBox({
          type: 'info',
          message: 'Save dnsmasq config success'
        })
      )
      .catch((ex) =>
        dialog.showErrorBox('Save dnsmasq config error', ex.message)
      );
  };
  MainScreen.onViewEvent = {
    resolvSet: () =>
      dnsmasqHandler
        .setResolvConf()
        .then(() =>
          dialog.showMessageBox({
            type: 'info',
            message: 'Set resolv.conf success'
          })
        )
        .catch((ex) =>
          dialog.showErrorBox('Set resolv.conf error', ex.message)
        ),
    resolvReset: () =>
      dnsmasqHandler
        .resetResolvConf()
        .then(() =>
          dialog.showMessageBox({
            type: 'info',
            message: 'Reset resolv.conf success'
          })
        )
        .catch((ex) =>
          dialog.showErrorBox('Reset resolv.conf error', ex.message)
        ),
    start: () =>
      dnsmasqHandler
        .start()
        .then(() =>
          dialog.showMessageBox({
            type: 'info',
            message: 'Start dnsmasq service success'
          })
        )
        .catch((ex) =>
          dialog.showErrorBox('Start dnsmasq service error', ex.message)
        ),
    stop: () =>
      dnsmasqHandler
        .stop()
        .then(() =>
          dialog.showMessageBox({
            type: 'info',
            message: 'Stop dnsmasq service success'
          })
        )
        .catch((ex) =>
          dialog.showErrorBox('Stop dnsmasq service error', ex.message)
        ),
    enable: () =>
      dnsmasqHandler
        .enable()
        .then(() =>
          dialog.showMessageBox({
            type: 'info',
            message: 'Enable dnsmasq service success'
          })
        )
        .catch((ex) =>
          dialog.showErrorBox('Enable dnsmasq service error', ex.message)
        ),
    restart: () =>
      dnsmasqHandler
        .restart()
        .then(() =>
          dialog.showMessageBox({
            type: 'info',
            message: 'Restart dnsmasq service success'
          })
        )
        .catch((ex) =>
          dialog.showErrorBox('Restart dnsmasq service error', ex.message)
        ),
    reload: () =>
      dnsmasqHandler
        .reload()
        .then(() =>
          dialog.showMessageBox({
            type: 'info',
            message: 'Reload dnsmasq service success'
          })
        )
        .catch((ex) =>
          dialog.showErrorBox('Reload dnsmasq service error', ex.message)
        )
  };

  if (InstallerScreen.store.isInstalled()) {
    MainScreen.show();
    MainScreen.loadData();
  } else {
    InstallerScreen.createScreen();
    InstallerScreen.onceShow(() => {
      setTimeout(() => {
        InstallerScreen.hide();
        InstallerScreen.close();
        MainScreen.show();
        MainScreen.loadData();
      }, 6000);
    });
    InstallerScreen.loadView();
    InstallerScreen.show();
  }
});
