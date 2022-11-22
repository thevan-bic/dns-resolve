import 'electron';

declare global {
  interface Window {
    getCurrentWindow(...args: unknown[]): unknown;
    openMenu(...args: unknown[]): unknown;
    minimizeWindow(...args: unknown[]): unknown;
    unmaximizeWindow(...args: unknown[]): unknown;
    maxUnmaxWindow(...args: unknown[]): unknown;
    isWindowMaximized(...args: unknown[]): unknown;
    closeWindow(...args: unknown[]): unknown;
  }
}
