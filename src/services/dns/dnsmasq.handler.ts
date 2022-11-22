import {
  DNSMASQ_ENABLE,
  DNSMASQ_END_CONFIG,
  DNSMASQ_RELOAD,
  DNSMASQ_RESTART,
  DNSMASQ_START,
  DNSMASQ_START_CONFIG,
  DNSMASQ_STOP,
  RESOLV_RESET_SCRIPT,
  RESOLV_SET_SCRIPT, SET_LO_NAMESERVER_SCRIPT
} from '../../constants';
import { exec } from 'sudo-prompt';
import { DNSConfig, ExecOptions } from '../../types';

export class DnsmasqHandler {
  public static execOptions: ExecOptions = {
    name: 'DNSMASQ Handler'
  };

  public googleNameservers = ['8.8.8.8'];

  protected getSpecServerTemplate(
    hostname: string,
    nameserver: string
  ): string {
    return `server=/${hostname}/${nameserver}\n`;
  }

  protected getServerTemplate(nameserver: string): string {
    return `server=${nameserver}\n`;
  }

  /**
   * Save DNSMASQ Config
   * @param config
   */
  public async saveConfig(config: DNSConfig[]): Promise<boolean> {
    const specServers = config
      .map((c) => this.getSpecServerTemplate(c.hostname, c.nameserver))
      .join('');

    const servers = [
      ...new Set(config.map((c) => c.nameserver)),
      ...this.googleNameservers
    ]
      .map((ns) => this.getServerTemplate(ns))
      .join('');

    const updateConfScript = `${DNSMASQ_START_CONFIG}${specServers}${servers}${DNSMASQ_END_CONFIG} && ${SET_LO_NAMESERVER_SCRIPT} && ${DNSMASQ_RESTART}`;

    return new Promise((resolve, reject) => {
      exec(updateConfScript, DnsmasqHandler.execOptions, (error) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });
  }

  /**
   * Start DNSMASQ Service
   */
  public async start(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      exec(DNSMASQ_START, DnsmasqHandler.execOptions, (error) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });
  }

  /**
   * Stop DNSMASQ Service
   */
  public async stop(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      exec(DNSMASQ_STOP, DnsmasqHandler.execOptions, (error) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });
  }

  /**
   * Restart DNSMASQ Service
   */
  public async restart(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      exec(DNSMASQ_RESTART, DnsmasqHandler.execOptions, (error) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });
  }

  /**
   * Reload DNSMASQ Service
   */
  public async reload(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      exec(DNSMASQ_RELOAD, DnsmasqHandler.execOptions, (error) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });
  }

  /**
   * Enable DNSMASQ Service
   */
  public async enable(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      exec(DNSMASQ_ENABLE, DnsmasqHandler.execOptions, (error) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });
  }

  /**
   * Set Resolv Conf
   */
  public async setResolvConf(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      exec(RESOLV_SET_SCRIPT, DnsmasqHandler.execOptions, (error) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });
  }

  /**
   * Reset Resolv Conf
   */
  public async resetResolvConf(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      exec(RESOLV_RESET_SCRIPT, DnsmasqHandler.execOptions, (error) => {
        if (error) {
          reject(error);
        }
        resolve(true);
      });
    });
  }
}
