import { STORE_KEY } from '../../constants';
import { LocalStore } from '../../services/store';

export class InstallStore {
  private store: LocalStore;

  public constructor() {
    this.store = LocalStore.getInstance();
  }

  public isInstalled(): boolean {
    try {
      return this.store.get<boolean>(STORE_KEY.MARK_INSTALL);
    } catch (ex) {
      return false;
    }
  }

  public markInstall(): boolean {
    try {
      this.store.set(STORE_KEY.MARK_INSTALL, true);
      return true;
    } catch (ex) {
      return false;
    }
  }

  public unmarkInstall(): boolean {
    try {
      this.store.set(STORE_KEY.MARK_INSTALL, false);
      return true;
    } catch (ex) {
      return false;
    }
  }
}
