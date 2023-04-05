function createPopup(title) {
  const wrapper = document.createElement('div');
  const popup = document.createElement('div');
  const header = document.createElement('div');
  wrapper.classList.add('popup-wrapper');
  popup.classList.add('popup');
  popup.setAttribute('data-simplebar', '');
  header.classList.add('popup__header');

  //шапка
  const heading = document.createElement('h3');
  heading.classList.add('popup__heading');
  heading.textContent = title;
  const closePopupBtn = createCloseBtn(wrapper);
  header.append(heading);
  header.append(closePopupBtn);

  //попап закроется, если кликнуть на свободную область
  document.addEventListener('click', e => {
    let target = e.target; //это элемент, на который кликнул пользователь
    if (target.classList.contains('popup-wrapper')) {
      history.pushState("", document.title, window.location.pathname);
      target.remove();
    }
  })

  wrapper.append(popup);
  popup.append(header);

  return {
    wrapper,
    popup,
    header,
  }
}

function createDelPopup(client) {
  const popupElements = createPopup('Удалить клиента');
  const wrapper = popupElements.wrapper;
  const popup = popupElements.popup;
  const header = popupElements.header;
  popup.removeAttribute('data-simplebar', '');//для этого попапа точно не нужен скроллбар
  header.classList.add('del-popup__header');

  //предупреждение
  const warning = document.createElement('p');
  warning.classList.add('del-popup__warning', blackTextClass);
  warning.textContent = 'Вы действительно хотите удалить данного клиента?';

  //обёртка для кнопок удаления и отмены
  const bottomButtons = document.createElement('div');
  bottomButtons.classList.add('popup__btn-wrapper');

  //кнопка удаления
  const delClientBtn = createVioletButton('Удалить');

  delClientBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    fetch (`http://localhost:3000/api/clients/${client.id}`, {
    method: 'DELETE',
    });
    const clientRow = document.getElementById(`row-${client.id}`);
    clientRow.remove();
    wrapper.remove();
  });

  //кнопка отмены
  const cancelBtn = createCancelBtn(wrapper);

  //собираем
  container.append(wrapper);
  popup.append(warning);
  popup.append(bottomButtons);
  bottomButtons.append(delClientBtn);
  bottomButtons.append(cancelBtn);
}

function createNewClientPopup() {
  //здесь будут храниться данные об инпутах с контактами
  let contactElements = [];

  const popupElements = createPopup('Новый клиент');
  const wrapper = popupElements.wrapper;
  const popup = popupElements.popup;

  const form = document.createElement('form');
  form.classList.add('form');
  
  //форма
  const surnameElements = createTextInput(true, '', '', 'Фамилия');
  const nameElements = createTextInput(true, '', '', 'Имя');
  const lastNameElements = createTextInput(false, '', '', 'Отчество');
  const surnameInput = surnameElements.input;
  const nameInput = nameElements.input;
  const lastNameInput = lastNameElements.input;

  //блок с контактами
  const contactsInForm = document.createElement('fieldset');
  contactsInForm.classList.add('fieldset_contacts');
  const addContactBtn = createAddContactBtn(contactsInForm, contactElements);
  contactsInForm.append(addContactBtn);

  //кнопка сохранения
  const inputs = {
    surname: surnameInput,
    name: nameInput,
    lastName: lastNameInput,
    contacts: contactElements,
  };
  const saveBtn = createSaveBtn(inputs, wrapper, 'POST');

  //кнопка отмены
  const cancelBtn = createCancelBtn(wrapper);

  //обёртка для кнопок сохранения и удаления
  const bottomButtons = document.createElement('div');
  bottomButtons.classList.add('popup__btn-wrapper');
  bottomButtons.append(saveBtn);
  bottomButtons.append(cancelBtn);

  //собираем
  form.append(surnameElements.label);
  form.append(nameElements.label);
  form.append(lastNameElements.label);
  form.append(contactsInForm);
  form.append(bottomButtons);
  popup.append(form);
  container.append(wrapper);
}

async function createUpdatePopup(clientID) {
  //ищём клиента по id
  const response = await fetch(`http://localhost:3000/api/clients/${clientID}`);
  const client = await response.json();

  //когда всё подгрузилось, убираем индикатор загрузки с кнопки "Изменить"
  const updateButton = document.getElementById(`row-${clientID}`).querySelector('.update-btn');
  if (updateButton.classList.contains('update-btn_load')) {
    updateButton.classList.remove('update-btn_load');
  };

  // рисуем попап
  const popupElements = createPopup('Изменить данные');
  const wrapper = popupElements.wrapper;
  const popup = popupElements.popup;
  const header = popupElements.header;

  //здесь будут храниться данные об инпутах с контактами
  let contactElements = [];

  const form = document.createElement('form');
  form.classList.add('form', 'change-client-form');

  const idElem = document.createElement('span');
  idElem.classList.add(lightGreyTextClass);
  idElem.textContent = `ID: ${clientID}`;
  header.append(idElem);

  //форма
  const surnameElement = createTextInput(true, 'Фамилия', client.surname);
  const nameElement = createTextInput(true, 'Имя', client.name);
  const lastNameElement = createTextInput(false, 'Отчество', client.lastName);
  const surnameInput = surnameElement.input;
  const nameInput = nameElement.input;
  const lastNameInput = lastNameElement.input;

  //блок с контактами
  const contactsInForm = document.createElement('fieldset');
  contactsInForm.classList.add('fieldset_contacts');

  for (i = 0; i < client.contacts.length; i++) {
    const contact = client.contacts[i];
    const contactElement = createContactInput(contact, contactsInForm, contactElements);
    contactsInForm.append(contactElement.wrapper);
  };

  if (contactElements.length < 10) {
    const addContactBtn = createAddContactBtn(contactsInForm, contactElements);
    contactsInForm.append(addContactBtn);
  };

  //кнопка сохранения
  const inputs = {
    surname: surnameInput,
    name: nameInput,
    lastName: lastNameInput,
    contacts: contactElements,
  };
  const saveBtn = createSaveBtn(inputs, wrapper, 'PATCH', clientID);

  //кнопка удаления клиента 
  const delBtn = document.createElement('button');
  delBtn.classList.add('button_transparent', 'underlined-text');
  delBtn.textContent = 'Удалить клиента';
  delBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    history.pushState("", document.title, window.location.pathname);
    wrapper.remove();
    createDelPopup(client);
  });

  //обёртка для кнопок сохранения и удаления
  const bottomButtons = document.createElement('div');
  bottomButtons.classList.add('popup__btn-wrapper');
  bottomButtons.append(saveBtn);
  bottomButtons.append(delBtn);

  //собираем
  form.append(surnameElement.label);
  form.append(nameElement.label);
  form.append(lastNameElement.label);
  form.append(contactsInForm);
  form.append(bottomButtons);

  popup.append(form);
  container.append(wrapper);
}