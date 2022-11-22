import { LocalStore } from '../../services/store';
import { DNSConfig } from '../../types';
import { STORE_KEY } from '../../constants';

export class MainStore {
  private store: LocalStore;

  public constructor() {
    this.store = LocalStore.getInstance();
  }

  public saveConfig(config: DNSConfig[]): boolean {
    try {
      this.store.set(STORE_KEY.DNS_RESOLVE_CONFIG, config);
      return true;
    } catch (ex) {
      return false;
    }
  }

  public getConfig(): DNSConfig[] {
    try {
      return this.store.get<DNSConfig[]>(STORE_KEY.DNS_RESOLVE_CONFIG);
    } catch (ex) {
      return [];
    }
  }
}
