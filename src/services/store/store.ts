import ElectronStore from 'electron-store';

export class LocalStore {
  private static instance: LocalStore;

  private readonly store: ElectronStore;

  public getStore(): ElectronStore {
    return this.store;
  }

  private constructor(store: ElectronStore) {
    this.store = store;
  }

  public static getInstance(): LocalStore {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new LocalStore(new ElectronStore());
    return this.instance;
  }

  public get<T>(key: string): T {
    return this.store.get(key) as T;
  }

  public set(key: string, value: unknown): void {
    return this.store.set(key, value);
  }
}
