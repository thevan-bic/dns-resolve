export const DNSMASQ_INFO = 'dnsmasq --help';

export const DNSMASQ_ENABLE = 'systemctl enable dnsmasq';
export const DNSMASQ_STOP = 'systemctl stop dnsmasq';
export const DNSMASQ_START = 'systemctl start dnsmasq';
export const DNSMASQ_RELOAD = 'systemctl reload dnsmasq';
export const DNSMASQ_RESTART = 'systemctl restart dnsmasq';

export const RESOLV_RESET_SCRIPT = 'echo nameserver 8.8.8.8 > /etc/resolv.conf';
export const RESOLV_SET_SCRIPT = 'echo nameserver 127.0.0.1 > /etc/resolv.conf';

export const DNSMASQ_START_CONFIG = `
echo 'listen-address=127.0.0.1
port=53
no-dhcp-interface=127.0.0.1
bind-interfaces
domain-needed
strict-order
expand-hosts
bogus-priv
no-hosts
log-queries
no-negcache\n`;

export const DNSMASQ_END_CONFIG = `' > /etc/dnsmasq.conf`;

export enum IPC_CHANNEL {
  DNSMASQ_CONFIG_CHANGED = 'DNSMASQ_CONFIG_CHANGED',
  DNSMASQ_INSTALL_STDOUT = 'DNSMASQ_INSTALL_STDOUT',
  DNSMASQ_LOAD_CONFIG = 'DNSMASQ_LOAD_CONFIG',
  DNSMASQ_ENABLE = 'DNSMASQ_ENABLE',
  DNSMASQ_STOP = 'DNSMASQ_STOP',
  DNSMASQ_START = 'DNSMASQ_START',
  DNSMASQ_RELOAD = 'DNSMASQ_RELOAD',
  DNSMASQ_RESTART = 'DNSMASQ_RESTART',
  RESOLV_RESET = 'RESOLV_RESET',
  RESOLV_SET = 'RESOLV_SET'
}

export enum STORE_KEY {
  DNS_RESOLVE_CONFIG = 'dns_resolve_config',
  MARK_INSTALL = 'dns_mqs'
}

export const SET_LO_NAMESERVER_SCRIPT=`echo 'nameserver 127.0.0.1' > /etc/resolv.conf`
export const INSTALL_SCRIPT = (password) =>`
echo '==================== UPDATE SOFTWARE ============================='
echo ${password} | sudo -S apt-get update

echo '==================== INSTALL DNSMASQ ============================='
echo ${password} | sudo -S apt-get install -y dnsmasq
echo ${password} | sudo -S service dnsmasq stop
echo ${password} | sudo -S systemctl enable dnsmasq

echo '==================== DISABLE SYSTEMD-RESOLVED ===================='
echo ${password} | sudo -S systemctl disable systemd-resolved
echo ${password} | sudo -S systemctl stop systemd-resolved

`