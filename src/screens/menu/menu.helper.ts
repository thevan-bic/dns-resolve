import { ipcRenderer } from 'electron';

export class MenuHelper {
  public static openMenu(x: number, y: number): void {
    ipcRenderer.send(`display-app-menu`, { x, y });
  }

  public static minimizeWindow(): void {
    ipcRenderer.send(`minimizeWindow`, undefined);
  }

  public static closeWindow(): void {
    ipcRenderer.send(`closeWindow`, undefined);
  }
}
