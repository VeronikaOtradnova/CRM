function createTextInput(required, description, value, placeholder) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.classList.add('label_text-input');
  input.classList.add('text-input');
  input.setAttribute('type', 'text');

  if (description && required === true) {
    const descriptionElement = document.createElement('span');
    descriptionElement.classList.add('input-desctiption', 'input-desctiption_required');
    descriptionElement.textContent = description;

    label.append(descriptionElement);
  } else if (description) {
    const descriptionElement = document.createElement('span');
    descriptionElement.classList.add('input-desctiption');
    descriptionElement.textContent = description;

    label.append(descriptionElement);
  }

  if (value) {
    input.setAttribute('value', value);
  }

  function createPlaceholder(text, required) {
    const placeholderElement = document.createElement('span');
    placeholderElement.classList.add('custom-placeholder');
    if (required === 'required') {
      placeholderElement.classList.add('custom-placeholder_required');
    }
    placeholderElement.textContent = text;

    input.addEventListener('focus', () => {
      placeholderElement.classList.add('hidden');
    })
    input.addEventListener('blur', () => {
      if (!input.value) {
        placeholderElement.classList.remove('hidden');
      }
    })

    return placeholderElement;
  }

  if (placeholder && required === true) {
    const placeholderElement = createPlaceholder(placeholder, 'required');
    label.append(placeholderElement);
  } else if (placeholder) {
    const placeholderElement = createPlaceholder(placeholder);
    label.append(placeholderElement);
  }

  label.append(input);
  return {
    label,
    input,
  };
}

function createAddContactBtn(form, contactElements) {
  const button = document.createElement('button');
  button.classList.add('button_transparent', 'add-contact-btn', blackTextClass);
  button.textContent = 'Добавить контакт';

  button.addEventListener('click', (event) => {
    event.preventDefault();
    if (contactElements.length < 9) {
      const contactElement = createContactInput('', form, contactElements);
      button.before(contactElement.wrapper);
    } else if (contactElements.length === 9) {
      const contactElement = createContactInput('', form, contactElements);
      button.before(contactElement.wrapper);
      button.remove();
    }
  })

  return button;
}

function createSelect(contact, form, input) {
  const select = document.createElement('div');
  select.classList.add('select', 'select_contacts');
  const selectHead = document.createElement('div');
  selectHead.classList.add('select-head', 'select-head_contacts');

  if (contact) {
    switch (contact.type) {
      case 'phone':
        selectHead.textContent = 'Телефон';
        break;
      case 'email':
        selectHead.textContent = 'Email';
        break;
      case 'vk':
        selectHead.textContent = 'Vk';
        break;
      case 'fb':
        selectHead.textContent = 'Facebook';
        break;
      default:
        selectHead.textContent = 'Другое';
        break;
    };
  } else {
    selectHead.textContent = 'Телефон';
  };

  const selectBody = document.createElement('div');
  selectBody.classList.add('select-body', 'select-body_contacts', 'hidden');
  const optionsList = document.createElement('ul');
  optionsList.classList.add('select__options-list', 'select__options-list_contacts');

  function createOption(name) {
    const option = document.createElement('li');
    option.classList.add('select__option', 'select__option_contacts');
    option.textContent = name;
    
    option.addEventListener('click', () => {
      const optionValue = option.textContent;
      const headValue = selectHead.textContent;
      option.remove();
      optionsList.append(createOption(headValue));
      selectHead.textContent = optionValue;
      selectBody.classList.add('hidden');

      //в зависимости выбранного значения устанавливаем тип инпута
      switch (option.textContent) {
        case 'Телефон':
          input.type = 'tel';
          break;
        case 'Email':
          input.type = 'email';
          break;
        default:
            input.type = 'text';
            break;
      };
    });

    return option;
  }

  const optionsNames = ['Телефон', 'Email', 'Vk', 'Facebook', 'Другое'];
  optionsNames.forEach(name => {
    if (name !== selectHead.textContent) {
      optionsList.append(createOption(name));
    };
  });

  //когда пользователь открывает один селект, остальные закрываются
  selectHead.addEventListener('click', () => {
    const otherSelectBodies = form.querySelectorAll('.select-body_contacts');
    otherSelectBodies.forEach(otherSelectBody => {
      if (!otherSelectBody.classList.contains('hidden') && selectBody.classList.contains('hidden')) {
        otherSelectBody.classList.add('hidden');
      }
    });

    selectBody.classList.toggle('hidden');
    selectHead.classList.toggle('select-head_open');
  })

  select.append(selectHead);
  select.append(selectBody);
  selectBody.append(optionsList);

  return {
    select,
    selectHead,
    selectBody,
  }
}

function createContactInput(contact, form, contactElements) {
  //обёртка
  const wrapper = document.createElement('div');
  wrapper.classList.add('contact-input-wrapper');

  //инпут
  const input = document.createElement('input');
  input.classList.add('contact-input', blackTextClass);
  input.setAttribute('placeholder', 'Введите данные контакта');

  //селект
  const selectObject = createSelect(contact, form, input);
  const selectElement = selectObject.select;
  const selectHead = selectObject.selectHead;
  switch (selectHead.textContent) { //в зависимости от значения в селекте устанавливаем тип инпута
    case 'Телефон':
      input.type = 'tel';
      break;
    case 'Email':
      input.type = 'email';
      break;
    default:
      input.type = 'text';
      break;
  };

  input.addEventListener('click', () => {
    const allSelectBodies = form.querySelectorAll('.select-body_contacts');
    allSelectBodies.forEach(body => {
      if (!body.classList.contains('hidden')) {
        body.classList.add('hidden');
      }
    });
  })

  if (contact.value) {
    input.setAttribute('value', contact.value);
  };

  contactElements.push([selectHead, input]);

  //кнопка удаления контакта
  const delButton = document.createElement('button');
  delButton.classList.add('del-contact-button');
  delButton.addEventListener('click', (event) => {
    event.preventDefault();
    
    if (contactElements.length === 10) {
      wrapper.remove();
      form.append(createAddContactBtn(form, contactElements));
    } else {
      wrapper.remove();
    }

    const index = contactElements.findIndex(elem => 
      elem[0] === selectHead && elem[1] === input);
    contactElements.splice(index, 1);
  })

  wrapper.append(selectElement);
  wrapper.append(input);
  wrapper.append(delButton);

  return {
    wrapper,
    selectHead,
    input,
  }
}

function createErrorMessage(error) {
  const errorMessage = document.createElement('p');
  errorMessage.classList.add('red-text');

  if (error === 200 || error === 201) {
    return;
  } else if (error === 422 || error === 404 || (error > 499 && error < 601)) {
    errorMessage.textContent = `Ошибка ${error}`;
  } else if (error === 'В форме остались незаполненные или некорректно заполненные поля') {
    errorMessage.textContent = error;
  } else {
    errorMessage.textContent = 'Что-то пошло не так...';
  }

  return errorMessage;
}

function writeNewData(inputs) {
  //inputs = { surname: ..., name: ..., lastName: ..., contacts: [....] }

  const newData = {}
  newData.surname = inputs.surname.value;
  newData.name = inputs.name.value;
  newData.lastname = inputs.lastName.value;
  newData.contacts = [];

  inputs.contacts.forEach(element => {
    let type;
    switch (element[0].textContent) {
      case 'Телефон':
        type = 'phone';
        break;
      case 'Email':
        type = 'email';
        break;
      case 'Vk':
        type = 'vk';
        break;
      case 'Facebook':
        type = 'fb';
        break;
      case 'Другое':
        type = 'other';
    }
    const value = element[1].value.trim();
    newData.contacts.push({type: type, value: value});
  });

  return newData;
}

async function saveNewData(newData, methodOfRequest, clientID) {
  //clientID нужно передать, если methodOfRequest - 'PATCH'
  let urlOfRequest;
  if (methodOfRequest === 'PATCH'){
    urlOfRequest = `http://localhost:3000/api/clients/${clientID}`;
  } else if (methodOfRequest === 'POST') {
    urlOfRequest = 'http://localhost:3000/api/clients';
  }

  const response = await fetch(urlOfRequest, {
    method: methodOfRequest,
    body: JSON.stringify({
      name: newData.name,
      surname: newData.surname,
      lastName: newData.lastname,
      contacts: newData.contacts,
    }),
    headers: {
      'Content-Type': 'application/JSON',
    }
  });

  return response.status;
}

async function checkStatus(status, popupWrapper, saveBtn) {
  if (status > 199 && status < 300) {
    const allClients = await getAllClients();
    if (window.location.hash) history.pushState("", document.title, window.location.pathname);
    updateTable(allClients);
    popupWrapper.remove();
  } else {
    const errorMessage = createErrorMessage(status);
    saveBtn.classList.add('violet-btn_under-error');
    saveBtn.before(errorMessage);
  }
}