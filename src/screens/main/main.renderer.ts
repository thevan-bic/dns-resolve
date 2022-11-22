import * as JQ from 'jquery';
import { ipcRenderer } from 'electron';
import { DNSConfig } from '../../types';
import { IPC_CHANNEL } from '../../constants';

(($) => {
  const MainDOM = {
    Document: $(document),
    ConfigForm: $('#dns_config'),
    SaveConfigBtn: $('#save-btn'),
    AddNewBtn: $('#add_new'),
    RemoveBtn: '.remove-btn',
    ResolvResetBtn: $('#resolv-reset-btn'),
    ResolvSetBtn: $('#resolv-set-btn'),
    EventScreen: {
      Start: $('#dnsmasq-start-btn'),
      Stop: $('#dnsmasq-stop-btn'),
      Restart: $('#dnsmasq-restart-btn'),
      Reload: $('#dnsmasq-reload-btn')
    },
    registerHandleIPCEvents: (
      channel: string,
      handler: (data: unknown) => void
    ) => {
      ipcRenderer.on(channel, (_, data: unknown) => handler(data));
    }
  };

  MainDOM.Document.on('click', MainDOM.RemoveBtn, (event) => {
    event.preventDefault();
    event.stopPropagation();

    const removeBtn = $(event.target);
    const index = removeBtn.data('index');
    if (index !== 0) {
      removeBtn.closest('.wrap-input').remove();
    }
  });

  MainDOM.AddNewBtn.on('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const index = $('.remove').length;

    MainDOM.ConfigForm.append(`
        <div  style='margin-bottom: 10px' class='wrap-input'>
            <input  name ='hostname' data-index='${
              index + 1
            }'  placeholder='Hostname'/>
            <input name ='nameserver'  data-index='${
              index + 1
            }' placeholder='Nameserver'/>
            <button style='color: red' class='remove-btn' data-index='${
              index + 1
            }'  type='button'>x</button>
        </div>
        `);
  });

  MainDOM.SaveConfigBtn.on('click', (event) => {
    event.preventDefault();

    const formData = MainDOM.ConfigForm.serializeArray();
    const hostnames: string[] = [];
    const nameservers: string[] = [];
    formData.forEach((input) => {
      if (input.name === 'hostname') {
        hostnames.push(input.value);
      } else {
        nameservers.push(input.value);
      }
    });

    const saveData = hostnames
      .filter((h, index) => {
        return h && nameservers[index];
      })
      .map((h, index) => ({
        hostname: h,
        nameserver: nameservers[index]
      }));
    ipcRenderer.postMessage(IPC_CHANNEL.DNSMASQ_CONFIG_CHANGED, saveData);
  });

  MainDOM.registerHandleIPCEvents(
    IPC_CHANNEL.DNSMASQ_LOAD_CONFIG,
    (data: DNSConfig[]) => {
      data.forEach((d, index) => {
        MainDOM.ConfigForm.append(`
            <div  style='margin-bottom: 10px' class='wrap-input'>
                <input value='${d.hostname}' name ='hostname' data-index='${
          index + 1
        }'  placeholder='Hostname'/>
                <input value='${
                  d.nameserver
                }' name ='nameserver'  data-index='${
          index + 1
        }' placeholder='Nameserver'/>
                <button style='color: red' class='remove' data-index='${
                  index + 1
                }'  type='button'>x</button>
            </div>
        `);
      });
    }
  );

  MainDOM.EventScreen.Start.on('click', (event) => {
    event.preventDefault();
    ipcRenderer.postMessage(IPC_CHANNEL.DNSMASQ_START, undefined);
  });
  MainDOM.EventScreen.Stop.on('click', (event) => {
    event.preventDefault();
    ipcRenderer.postMessage(IPC_CHANNEL.DNSMASQ_STOP, undefined);
  });
  MainDOM.EventScreen.Restart.on('click', (event) => {
    event.preventDefault();
    ipcRenderer.postMessage(IPC_CHANNEL.DNSMASQ_RESTART, undefined);
  });
  MainDOM.EventScreen.Reload.on('click', (event) => {
    event.preventDefault();
    ipcRenderer.postMessage(IPC_CHANNEL.DNSMASQ_RELOAD, undefined);
  });

  MainDOM.ResolvResetBtn.on('click', (event) => {
    event.preventDefault();
    ipcRenderer.postMessage(IPC_CHANNEL.RESOLV_RESET, undefined);
  });

  MainDOM.ResolvSetBtn.on('click', (event) => {
    event.preventDefault();
    ipcRenderer.postMessage(IPC_CHANNEL.RESOLV_SET, undefined);
  });
})(JQ.default);
