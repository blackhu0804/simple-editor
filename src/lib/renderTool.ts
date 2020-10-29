interface toolConfigItem {
  name: string,
  command: string,
  params?: string
}

export function createToolBar(config: toolConfigItem[]): HTMLElement {
  let toolBar = document.createElement('div');
  toolBar.id = 'toolBar';
  toolBar.setAttribute('style', 'width: 500px;margin: 0 auto;');

  config.forEach(configItem => {
    let item = document.createElement('button');
    item.textContent = configItem.name;
    toolBar.appendChild(item);
    item.dataset.command = configItem.command;
    item.dataset.params = configItem.params;
  })

  return toolBar;
}