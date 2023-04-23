//HEADER 
function createHeader() {
  const header = document.createElement('header');
  header.classList.add('header');

  //лого
  const logo = document.createElement('div');
  logo.classList.add('logo');

  //поиск
  const searchInput = createSearchInput();

  header.append(logo);
  header.append(searchInput);

  return {
    header,
    logo,
  };
}

function showClientInTable(client) {
  const allRows = document.querySelectorAll('tr');
  allRows.forEach(row => {
    if (row.classList.contains('row_highlighted')) row.classList.remove('row_highlighted');
  })

  const currentRow = document.getElementById(`row-${client.id}`);
  document.activeElement.blur();
  currentRow.focus();
  currentRow.classList.add('row_highlighted');
  currentRow.scrollIntoView({block: 'center', behavior: 'smooth'});
  currentRow.addEventListener('click', () => {
    currentRow.classList.remove('row_highlighted');
  })
}

function createKeyboardNavigation(keyboardNavigationList, clientsInList) {
  let activeItemIndex = 0;

  keyboardNavigationList.forEach(item => {
    item.addEventListener('keydown', (event) => {
      let newActiveItem;

      keyboardNavigationList.forEach(navItem => {
        if (navItem.classList.contains('keyboard-nav__focus')) {
          navItem.classList.remove('keyboard-nav__focus');
        }
      })

      switch (event.code) {
        case 'ArrowDown':
          if (activeItemIndex === (keyboardNavigationList.length - 1)) {
            activeItemIndex = 0;
          } else {
            activeItemIndex += 1;
          }
          newActiveItem = keyboardNavigationList[activeItemIndex];
          newActiveItem.classList.add('keyboard-nav__focus');
          break;
        case 'ArrowUp':
          if (activeItemIndex === 0) {
            activeItemIndex = keyboardNavigationList.length - 1;
          } else {
            activeItemIndex -= 1;
          }
          newActiveItem = keyboardNavigationList[activeItemIndex];
          newActiveItem.classList.add('keyboard-nav__focus');
          break;
        case 'Enter':
          event.preventDefault();
          if (activeItemIndex) {
            const dropdown = document.querySelector('.search-dropdown');
            dropdown.classList.add('hidden');
            showClientInTable(clientsInList[activeItemIndex - 1]);
          }
          break;
      };
    })
  })
}

function createSearchInput() {
  const searchWrapper = document.createElement('div');
  searchWrapper.classList.add('search');

  const input = document.createElement('input');
  input.classList.add('search__child', 'search-input');
  input.setAttribute('tabindex', '0');
  input.placeholder = 'Введите запрос';

  const dropdown = document.createElement('div');
  dropdown.classList.add('search__child', 'search-dropdown', 'hidden');

  const resultsist = document.createElement('ul');
  resultsist.classList.add('search-results');

  input.addEventListener('click', () => {
    if (input.value && dropdown.classList.contains('hidden')) {
      dropdown.classList.remove('hidden');
    }
  })

  let timerId;
  input.addEventListener('input', () => {
    if (input.value.trim()) {
      clearTimeout(timerId);
      timerId = setTimeout(findClient, 300);
    }
  });

  async function findClient() {
    searchWrapper.classList.add('search_load'); // добавляем индикатор загрузки
    const clients = await getAllClients();
    searchWrapper.classList.remove('search_load'); // удаляем добавляем индикатор загрузки

    const relevantClients = [];
    let allFullNames = clients.map(client => `${client.surname} ${client.name} ${client.lastName}`
    .toLowerCase().split('ё').join('е'));

    //если был открыт выпадающий список, и пользователь удалил запрос
    const whatFind = input.value.toLowerCase().split('ё').join('е');
    if(!whatFind && !dropdown.classList.contains('hidden')) {
      dropdown.classList.add('hidden');
      return;
    }

    //если в списке остались айтемы после предыдущего поиска, удаляем их
    const oldResultItems = document.querySelectorAll('.search-results__item');
    if (oldResultItems.length) {
      oldResultItems.forEach(item => item.remove());
    }

    //ищем подходящих клиентов
    allFullNames.forEach(fullName => {
      if (fullName.includes(whatFind)) {
        const fullNameArray = fullName.split(' ');
        const surname = fullNameArray[0];
        const name = fullNameArray[1];
        const lastName = fullNameArray[2];

        const correctClient = clients.find(client => 
          client.surname.toLowerCase().split('ё').join('е') === surname &&
          client.name.toLowerCase().split('ё').join('е') === name &&
          client.lastName.toLowerCase().split('ё').join('е') === lastName
        );

        if (correctClient) {
          //на случай, если будет несколько клиентов с одинаковым фио
          const correctClientIndex = clients.findIndex(client => client.id === correctClient.id);
          clients.splice(correctClientIndex, 1);

          //создаём айтем для списка с совпадениями
          const resultItem = document.createElement('li');
          resultItem.classList.add('search-results__item');
          resultItem.textContent = `${surname} ${name}`;
          resultsist.append(resultItem);

          resultItem.addEventListener('click', () => {
            showClientInTable(correctClient);
          })

          relevantClients.push(correctClient);
        };        
      }
    });
    
    //если подходящие клиенты нашлись, показываем их список в выпадающем меню
    if (relevantClients.length) {
      dropdown.classList.remove('hidden');
      
      //и делаем так, чтобы им можно было воспользоваться с помощью клавиатуры
      const keyboardNavigationList = [];
      keyboardNavigationList.push(input);
      document.querySelectorAll('.search-results__item').forEach(resultItem => {
        keyboardNavigationList.push(resultItem);
      })
      createKeyboardNavigation(keyboardNavigationList, relevantClients);

      document.addEventListener('click', event => {
        const target = event.target;

        //выпадающий список закроется, если кликнуть куда-то кроме инпута
        if (!dropdown.classList.contains('hidden') && target !== input) {
          dropdown.classList.add('hidden');
        }
      })
    }
  }

  searchWrapper.append(input);
  searchWrapper.append(dropdown);
  dropdown.append(resultsist);

  return searchWrapper;
}