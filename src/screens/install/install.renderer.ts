import * as JQ from 'jquery';
import { ipcRenderer } from 'electron';
import { IPC_CHANNEL } from '../../constants';

(($) => {
  const InstallDOM = {
    Document: $(document),
    LoggerView: $('#logger-view'),
    LoggerWrapper: $('#log-content'),
    registerHandleIPCEvents: (
      channel: string,
      handler: (data: unknown) => void
    ) => {
      ipcRenderer.on(channel, (_, data: unknown) => handler(data));
    }
  };

  InstallDOM.registerHandleIPCEvents(
    IPC_CHANNEL.DNSMASQ_INSTALL_STDOUT,
    (data) => {
      InstallDOM.LoggerView.append(`<pre>${data}</pre>`);
      InstallDOM.LoggerWrapper.animate({scrollTop: InstallDOM.LoggerWrapper.prop("scrollHeight")}, 1);
    }
  );
})(JQ.default);
