import { MenuHelper } from './screens/menu';

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(
      `${type}-version`,
      process.versions[type as keyof NodeJS.ProcessVersions]
    );
  }

  window.openMenu = MenuHelper.openMenu;
  window.minimizeWindow = MenuHelper.minimizeWindow;
  window.closeWindow = MenuHelper.closeWindow;

  handlerMenu();
});

function handlerMenu() {
  const menuButton = document.getElementById('menu-btn');
  const minimizeButton = document.getElementById('minimize-btn');
  const closeButton = document.getElementById('close-btn');

  menuButton.addEventListener('click', (e) => {
    // Opens menu at (x,y) coordinates of mouse click on the hamburger icon.
    window.openMenu(e.x, e.y);
  });

  minimizeButton.addEventListener('click', (e) => {
    window.minimizeWindow();
  });

  closeButton.addEventListener('click', (e) => {
    window.closeWindow();
  });
}
