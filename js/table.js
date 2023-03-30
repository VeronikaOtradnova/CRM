function createContactIcons(client) {
  const contactIconsWrapper = document.createElement('div');
  contactIconsWrapper.classList.add('contacts-cell__btn-wrapper');
  const contactIcons = []; //счётчик иконок в ячейке

  client.contacts.forEach(contact => {
    //выбираем иконку для контакта
    const contactIcon = document.createElement('div');
    contactIcon.classList.add('contact-icon');
    switch (contact.type) {
      case 'phone':
        contactIcon.classList.add('phone-icon');
        break;
      case 'email':
        contactIcon.classList.add('email-icon');
        break;
      case 'vk':
        contactIcon.classList.add('vk-icon');
        break;
      case 'fb':
        contactIcon.classList.add('fb-icon');
        break;
      default:
        contactIcon.classList.add('other-contact-icon');
        break;
    };
    contactIcons.push(contactIcon);

    //добавляем тултип для контакта
    let tooltipElem;
    contactIcon.addEventListener('mouseover', () => {
      // создадим элемент для подсказки
      tooltipElem = document.createElement('div');
      tooltipElem.classList.add('tooltip');

      //что будет отображаться в тултипе
      const content = document.createElement('div');
      content.classList.add('tooltip__content');

      const contactTypeElem = document.createElement('span');
      contactTypeElem.classList.add('tooltip__type');
      switch(contact.type) {
        case 'phone':
        contactTypeElem.textContent = 'Телефон: ';
        break;
      case 'email':
        contactTypeElem.textContent = 'Email: ';
        break;
      case 'vk':
        contactTypeElem.textContent = 'Vk: ';
        break;
      case 'fb':
        contactTypeElem.textContent = 'Facebook: ';
        break;
      default:
        contactTypeElem.textContent = 'Другое: ';
        break;
      }

      const contactValueElem = document.createElement('span');
      contactValueElem.classList.add('tooltip__value');
      contactValueElem.textContent = contact.value;

      //собираем
      content.append(contactTypeElem);
      content.append(contactValueElem);
      tooltipElem.append(content);
      container.append(tooltipElem);

      // спозиционируем тултип сверху от иконки
      let coords = contactIcon.getBoundingClientRect();

      let top = coords.top - tooltipElem.offsetHeight - 5;
      if (top < 0) { // если тултип не помещается сверху, то не отображать его
        tooltipElem.remove();
        return;
      }

      let left = coords.left + (contactIcon.offsetWidth - tooltipElem.offsetWidth) / 2;
      if (left < 0) left = 0; // не заезжать за левый край окна

      tooltipElem.style.top = top + 'px';
      tooltipElem.style.left = left + 'px';
    });
    contactIcon.addEventListener('mouseout', () => {
      if (tooltipElem) {
        tooltipElem.remove();
      }
    });

    //скрываем иконку, если нужно, и добавляем в ячейку
    if (contactIcons.length > 4) {
      contactIcon.classList.add('hidden');
    }
    contactIconsWrapper.append(contactIcon);
  })

  //создаём открывашку для скрытых контактов
  if (contactIcons.length > 4) {
    const amountHiddenIcons = contactIcons.length - 4;
    const showIconsBtn = document.createElement('div');
    showIconsBtn.classList.add('contact-icon', 'more-contacts-icon');
    contactIconsWrapper.append(showIconsBtn);
    showIconsBtn.textContent = `+${amountHiddenIcons}`;

    showIconsBtn.addEventListener('click', () => {
      const allHiddenIcons = contactIconsWrapper.querySelectorAll('.hidden');
      allHiddenIcons.forEach(icon => icon.classList.remove('hidden'));
      showIconsBtn.remove();
    })
  }

  return contactIconsWrapper;
}

function addRows(clients, table) {
  //сразу расставляем клиентов в нужном порядке в зависимости от sorting_класса таблицы, так работает сортировка
  const sortedClients = [];

  if (table.classList.contains('sorting_id-ascending')) {
    const allID = clients.map(client => client.id);
    allID.sort((a, b) => a - b);
    findClientsByID(allID, clients, sortedClients);
  } else if (table.classList.contains('sorting_id-descending')) {
    const allID = clients.map(client => client.id);
    allID.sort((a, b) => b - a);
    findClientsByID(allID, clients, sortedClients);
  } else if (table.classList.contains('sorting_fullname-ascending')) {
    const allFullNames = clients.map(client => `${client.surname} ${client.name} ${client.lastName}`.toLowerCase());
    allFullNames.sort();
    findClientsByFullName(allFullNames, clients, sortedClients);
  } else if (table.classList.contains('sorting_fullname-descending')) {
    let allFullNames = clients.map(client => `${client.surname} ${client.name} ${client.lastName}`.toLowerCase());
    allFullNames.sort();
    allFullNames = allFullNames.reverse();
    findClientsByFullName(allFullNames, clients, sortedClients);
  } else if (table.classList.contains('sorting_creation-date-ascending')) {
    const allCreationDates = clients.map(client => Date.parse(client.createdAt));
    allCreationDates.sort((a, b) => a - b);
    findClientsByDate('createdAt', allCreationDates, clients, sortedClients);
  } else if (table.classList.contains('sorting_creation-date-descending')) {
    const allCreationDates = clients.map(client => Date.parse(client.createdAt));
    allCreationDates.sort((a, b) => b - a);
    findClientsByDate('createdAt', allCreationDates, clients, sortedClients);
  } else if (table.classList.contains('sorting_update-date-ascending')) {
    const allUpdateDates = clients.map(client => Date.parse(client.updatedAt));
    allUpdateDates.sort((a, b) => a - b);
    findClientsByDate('updatedAt', allUpdateDates, clients, sortedClients);
  } else if (table.classList.contains('sorting_update-date-descending')) {
    const allUpdateDates = clients.map(client => Date.parse(client.updatedAt));
    allUpdateDates.sort((a, b) => b - a);
    findClientsByDate('updatedAt', allUpdateDates, clients, sortedClients);
  }

  //ищем тело таблицы
  const tableBody = table.querySelector('tbody');

  sortedClients.forEach( client => {
    //здесь данные о клиенте
    const createdAt = client.createdAt;
    const creationDateAndTime = createdAt.split('T');
    const creationDate = creationDateAndTime[0];
    const creationTime = creationDateAndTime[1].split('.')[0];

    const updatedAt = client.updatedAt;
    const updateDateAndTime = updatedAt.split('T');
    const updateDate = updateDateAndTime[0];
    const updateTime = updateDateAndTime[1].split('.')[0];

    //dom
    const row = document.createElement('tr');
    row.classList.add('client-row');
    row.id = `row-${client.id}`;

    //ячейка с id
    const idCell = document.createElement('td');
    idCell.textContent = client.id;
    idCell.classList.add(lightGreyTextClass);

    //ячейка с фио
    const fullNameCell = document.createElement('td');
    fullNameCell.textContent = `${client.surname.trim()} ${client.name.trim()} ${client.lastName.trim()}`;
    fullNameCell.classList.add(blackTextClass);

    //ячейка с датой создания клиента
    const creationDateCell = document.createElement('td');
    const creationDateWrapper = document.createElement('div');
    const creationDateElement = document.createElement('span');
    const creationTimeElement = document.createElement('span');
    creationDateElement.textContent = creationDate;
    creationTimeElement.textContent = creationTime;
    creationDateWrapper.classList.add('date-wrapper');
    creationDateElement.classList.add(blackTextClass);
    creationTimeElement.classList.add(lightGreyTextClass);
    creationDateCell.append(creationDateWrapper);
    creationDateWrapper.append(creationDateElement);
    creationDateWrapper.append(creationTimeElement);

    //ячейка с датой обновления
    const updateDateCell = document.createElement('td');
    const updateDateWrapper = document.createElement('div');
    const updateDateElement = document.createElement('span');
    const updateTimeElement = document.createElement('span');
    updateDateElement.textContent = updateDate;
    updateTimeElement.textContent = updateTime;
    updateDateWrapper.classList.add('date-wrapper');
    updateDateElement.classList.add(blackTextClass);
    updateTimeElement.classList.add(lightGreyTextClass);
    updateDateCell.append(updateDateWrapper);
    updateDateWrapper.append(updateDateElement);
    updateDateWrapper.append(updateTimeElement);

    //ячейка с контактами
    const contactsCell = document.createElement('td');
    const contactIconsWrapper = createContactIcons(client);
    contactsCell.append(contactIconsWrapper);

    //кнопки
    const actionsCell = document.createElement('td');
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.classList.add('actions-cell__btn-wrapper');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.classList.add('button_transparent', 'action-cell__button', 'del-btn', blackTextClass);
    deleteButton.addEventListener('click', () => {
      createDelPopup(client);
    });

    const updateButton = document.createElement('div');
    const linkToUpdatePopup = document.createElement('a');
    linkToUpdatePopup.href = `index.html#${client.id}`;
    linkToUpdatePopup.classList.add(blackTextClass, 'update-client-link');
    linkToUpdatePopup.textContent = 'Изменить';
    updateButton.classList.add('button_transparent', 'action-cell__button', 'update-btn');
    updateButton.append(linkToUpdatePopup);
    updateButton.addEventListener('click', () => {
      updateButton.classList.add('update-btn_load');
    })

    buttonsWrapper.append(updateButton);
    buttonsWrapper.append(deleteButton);
    actionsCell.append(buttonsWrapper);

    //собираем
    tableBody.append(row);
    row.append(idCell);
    row.append(fullNameCell);
    row.append(creationDateCell);
    row.append(updateDateCell);
    row.append(contactsCell);
    row.append(actionsCell);
  })

  //всем ячейкам всех строк добавляем одинаковый класс
  let allHeadCells = table.querySelectorAll("td");
  allHeadCells.forEach(headCell => {
    headCell.classList.add('cell');
  });
}

function removeAllRows(table) {
  const rows = table.querySelectorAll('.client-row');
  rows.forEach(row => row.remove());
}

function updateTable(allClients) {
  const table = document.getElementById('crm-table');
  removeAllRows(table);
  addRows(allClients, table);
}

function changeTableCondition(table, currentSortingCell) {
  //У ячейки, которая отвечает за сортировку,  может быть три состояния:
  //- отсортировано по возрастанию (.ascending)
  //- отсортировано по убыванию (.descending)
  //- не отсортировано (.not-sorted) - по умолчанию

  //У таблицы может быть 8 состояний:
  // '.sorting_id-ascending', '.sorting_fullname-ascending', '.sorting_creation-date-ascending', '.sorting_update-date-ascending',
  // '.sorting_id-descending', '.sorting_fullname-descending', '.sorting_creation-date-descending', '.sorting_update-date-descending',

  const currentHeadingElem = currentSortingCell.querySelector('.table-head__heading');
  const currentID = currentSortingCell.id;

  //все остальные sorting_ячейки делаем неактивными
  const allCells = table.querySelectorAll('.sorting-cell');
  allCells.forEach(cell => {
    if (cell.id === currentID) {
      return;
    }

    const headingElem = cell.querySelector('.table-head__heading');

    if (cell.classList.contains('ascending')) {
      cell.classList.remove('ascending');
    } else if (cell.classList.contains('descending')) {
      cell.classList.remove('descending');
    }
    if (!cell.classList.contains('not-sorted')) {
      cell.classList.add('not-sorted');
    }
    if (headingElem.classList.contains('table-head__heading_active')) {
      headingElem.classList.remove('table-head__heading_active');
    }
    if (headingElem.classList.contains('table-head__heading_arrow-up')) {
      headingElem.classList.remove('table-head__heading_arrow-up');
      headingElem.classList.add('table-head__heading_arrow-down');
    }
  })

  //меняем состояние активной ячейки
  if (!currentHeadingElem.classList.contains('table-head__heading_active')) {
    currentHeadingElem.classList.add('table-head__heading_active');
  }

  if (currentSortingCell.classList.contains('not-sorted')) {
    currentHeadingElem.classList.remove('table-head__heading_arrow-down');
    currentHeadingElem.classList.add('table-head__heading_arrow-up');
    currentSortingCell.classList.remove('not-sorted');
    currentSortingCell.classList.add('ascending');
  } else if (currentSortingCell.classList.contains('descending')) {
    currentHeadingElem.classList.remove('table-head__heading_arrow-down');
    currentHeadingElem.classList.add('table-head__heading_arrow-up');
    currentSortingCell.classList.remove('descending');
    currentSortingCell.classList.add('ascending');
  } else if (currentSortingCell.classList.contains('ascending')) {
    currentHeadingElem.classList.remove('table-head__heading_arrow-up');
    currentHeadingElem.classList.add('table-head__heading_arrow-down');
    currentSortingCell.classList.remove('ascending');
    currentSortingCell.classList.add('descending');
  }

  //меняем состояние таблицы
  //собираем название sorting_класса для таблицы
  const sortingProperty = currentID.split('-column')[0];
  let sortingMethod;
  if (currentSortingCell.classList.contains('ascending')) {
    sortingMethod = 'ascending';
  } else if (currentSortingCell.classList.contains('descending')) {
    sortingMethod = 'descending';
  }
  const tableConditionClass = `sorting_${sortingProperty}-${sortingMethod}`;

  //удаляем старый sorting_класс
  table.classList.forEach(classForCheck => {
    if (classForCheck.includes('sorting_')) {
      table.classList.remove(classForCheck);
    }
  })

  //добавляем новый sorting_класс (меняем состояние таблицы)
  table.classList.add(tableConditionClass);
}

function createTable() {
  const table = document.createElement('table');
  table.setAttribute('cellPadding', '0');
  table.setAttribute('cellSpacing', '0');
  table.classList.add('table', 'sorting_id-ascending');
  table.id = 'crm-table';

  const windowWidth = document.documentElement.clientWidth;
  if (windowWidth < 321) {
    table.setAttribute('data-simplebar', '');
  }

  //шапка
  const tableHead = document.createElement('thead');
  tableHead.classList.add('table-head');
  const firstRow = document.createElement('tr');

  //создаём заглавные ячейки
  const columnHeadings = [
    'ID', 'Фамилия Имя Отчество', 'Дата и время создания', 
    'Последние изменения', 'Контакты', 'Действия',
  ]
  columnHeadings.forEach(heading => {
    const column = document.createElement('th');
    const headingElem = document.createElement('span');
    const alphabeticalSorting = document.createElement('span');

    headingElem.textContent = heading;
    alphabeticalSorting.textContent = 'А-Я';

    column.classList.add('table-head__cell', 'not-sorted');
    headingElem.classList.add('table-head__heading');
    alphabeticalSorting.classList.add('sorting_alphabetical');

    switch(heading) {
      case 'ID':
        column.id = 'id-column';
        column.classList.add('id-column', 'ascending', 'sorting-cell');
        column.classList.remove('not-sorted');
        headingElem.classList.add('table-head__heading_arrow-up');
        headingElem.classList.add('table-head__heading_active');
        break;
      case 'Фамилия Имя Отчество':
        column.id = 'fullname-column';
        column.classList.add('fullname-column', 'sorting-cell');
        headingElem.classList.add('table-head__heading_arrow-down');
        break;
      case 'Дата и время создания':
        column.id = 'creation-date-column';
        column.classList.add('date-column', 'creation-date-column', 'sorting-cell');
        headingElem.classList.add('table-head__heading_arrow-down');
        break;
      case 'Последние изменения':
        column.id = 'update-date-column';
        column.classList.add('date-column', 'update-date-column', 'sorting-cell');
        headingElem.classList.add('table-head__heading_arrow-down');
        break;
      case 'Контакты':
        column.id = 'contacts-column';
        column.classList.add('contacts-column');
        break;
      case 'Действия':
        column.id = 'actions-column';
        column.classList.add('actions-column');
        break;
    };

    column.append(headingElem);
    if (heading === 'Фамилия Имя Отчество') {
      headingElem.append(alphabeticalSorting);
    }
    firstRow.append(column);
  });

  //добавляем сортировку
  const idColumn = firstRow.querySelector('.id-column');
  idColumn.addEventListener('click', async () => {
    removeAllRows(table);
    const clients = await getAllClients();
    changeTableCondition(table, idColumn);
    addRows(clients, table);
  });

  const fullNameColumn = firstRow.querySelector('.fullname-column');
  fullNameColumn.addEventListener('click', async () => {
    removeAllRows(table);
    const clients = await getAllClients();
    changeTableCondition(table, fullNameColumn);
    addRows(clients, table);
  });

  const creationDateColumn = firstRow.querySelector('.creation-date-column');
  creationDateColumn.addEventListener('click', async () => {
    removeAllRows(table);
    const clients = await getAllClients();
    changeTableCondition(table, creationDateColumn);
    addRows(clients, table);
  })

  const updateDateColumn = firstRow.querySelector('.update-date-column');
  updateDateColumn.addEventListener('click', async () => {
    removeAllRows(table);
    const clients = await getAllClients();
    changeTableCondition(table, updateDateColumn);
    addRows(clients, table);
  })

  //загрузка
  const tableBody = document.createElement('tbody');
  tableBody.classList.add('table-body');

  const loadingRaw = document.createElement('tr');
  loadingRaw.id = 'loading-raw';
  const loadingCell = document.createElement('td');
  loadingCell.colSpan = '6';
  loadingCell.classList.add('loading-cell');
  const loadingImage = document.createElement('div');
  loadingImage.classList.add('table-loader');

  //всё собираем
  table.append(tableHead);
  table.append(tableBody);
  tableHead.append(firstRow);
  tableBody.append(loadingRaw);
  loadingRaw.append(loadingCell);
  loadingCell.append(loadingImage);

  //добавляем классы
  let allHeadCells = table.querySelectorAll("th");
  allHeadCells.forEach(headCell => {
    headCell.classList.add('table-head__cell');
  });

  return {
    table,
    loadingCell,
  }
}