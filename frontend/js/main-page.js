async function createMainPage() {
  //рисуем страницу, в таблице отображается индикатор загрузки
  const header = createHeader().header;
  const contentBlock = createContentBlock();
  const title = createTitle('Клиенты');

  const tableElements = createTable();
  const table = tableElements.table;
  const loadingCell = tableElements.loadingCell;

  const newClientBtn = createNewClientBtn();
  
  contentBlock.append(title);
  contentBlock.append(table);
  contentBlock.append(newClientBtn);
  container.append(header);
  container.append(contentBlock);

  //запрашиваем данные о клиентах...
  const response = await fetch('http://localhost:3000/api/clients');
  const allClients = await response.json();

  //если получили статус 2хх, то удаляем спиннер и добавляем в таблицу строки
  if (response.ok) {
    loadingCell.remove();
    addRows(allClients, table);
  };
  if (window.location.hash) { //если пользователь открывает ссылку на клиента
    const clientID = window.location.hash.substring(1);
    createUpdatePopup(clientID);
  }

  //если изменится хэш, то откроется модально окно
  window.addEventListener('hashchange', () => {
    const clientID = window.location.hash.substring(1);
    createUpdatePopup(clientID);
  })

}

createMainPage();