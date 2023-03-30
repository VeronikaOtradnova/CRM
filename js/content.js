function createContentBlock() {
  const contentBlock = document.createElement('div');
  contentBlock.classList.add('content');

  return contentBlock;
}

function createTitle(name) {
  const title = document.createElement('h1');
  title.classList.add('main-title');
  title.textContent = name;

  return title;
}

function createNewClientBtn() {
  const button = document.createElement('button');
  button.classList.add('new-client-btn');
  button.textContent = 'Добавить клиента';

 button.addEventListener('click', createNewClientPopup);

  return button;
}