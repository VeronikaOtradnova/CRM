function createCloseBtn(popupWrapper) {
  const button = document.createElement('button');
  button.classList.add('close-btn');
  button.tabIndex = 1;

  function closePopup() {
    history.pushState("", document.title, window.location.pathname);
    popupWrapper.remove();
  }

  button.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
      closePopup();
    } 
  })

  button.addEventListener('click', closePopup);

  return button;
}

function createVioletButton(text) {
  const button = document.createElement('button');
  button.classList.add('violet-button');
  button.textContent = text;

  return button;
}

function createCancelBtn(popupWrapper) {
  const button = document.createElement('button');
  button.tabIndex = 1;
  button.classList.add('button_transparent', 'underlined-text');
  button.textContent = 'Отмена'; 
  button.addEventListener('click', () => popupWrapper.remove());

  return button;
}

function createSaveBtn(inputs, popupWrapper, methodOfRequest, clientID) {
  //inputs = { surname: ..., name: ..., lastName: ..., contacts: [....] }

  const button = createVioletButton('Сохранить');
  button.tabIndex = 1;
  button.addEventListener('click', async (event) => {
    event.preventDefault();

    //если есть в форме старые ошибки валидации, удаляем их
    const oldError = popupWrapper.querySelector('.red-text');
    if (oldError) oldError.remove();

    //валидация
    const inputsForValidationCheck = [];
    const invalidInputs = [];
    inputsForValidationCheck.push(inputs.surname);
    inputsForValidationCheck.push(inputs.name);
    inputs.contacts.forEach(contact => {
      inputsForValidationCheck.push(contact[1]);
    });

    inputsForValidationCheck.forEach(input => {
      if (!input.value) {
        invalidInputs.push(input);
      } else if (input.type === 'tel' && isNaN(+input.value)) {
        invalidInputs.push(input);
      } else if (input.type === 'email' && !input.value.includes('@')) {
        invalidInputs.push(input);
      };
    })

    if (invalidInputs.length) {
      const validationError = createErrorMessage('В форме остались незаполненные или некорректно заполненные поля');
      button.before(validationError);

      invalidInputs.forEach (input => {
        input.style.backgroundColor = 'rgba(240, 106, 77, 0.2)';
        input.addEventListener('input', () => {
          input.style.backgroundColor = '#FFF';
        });
      });

      return;
    }

    //добавляем на кнопку индикатор загрузки и на время загрузки делаем форму недоступной для изменений
    button.classList.add('violet-button_load');
    const formDisabler = document.createElement('div');
    formDisabler.classList.add('form-disabler');
    popupWrapper.querySelector('.popup').append(formDisabler);

    const newData = writeNewData(inputs);
    const statusOfResponse = await saveNewData(newData, methodOfRequest, clientID);
    checkStatus(statusOfResponse, popupWrapper, button);
  });

  return button;
}