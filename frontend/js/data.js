async function getAllClients() {
  const response = await fetch('http://localhost:3000/api/clients');
  const allClients = await response.json();

  return allClients;
}

function findClientsByFullName(allFullNames, clients, relevantClients) {
  allFullNames.forEach(fullName => {
    const fullNameArray = fullName.split(' ');
    const sortSurname = fullNameArray[0];
    const sortName = fullNameArray[1];
    const sortLastName = fullNameArray[2];

    const correctClient = clients.find(client => client.surname.toLowerCase() === sortSurname &&
      client.name.toLowerCase() === sortName &&
      client.lastName.toLowerCase() === sortLastName);
    if (correctClient) {
      relevantClients.push(correctClient);
    };
  });
}

function findClientsByID(allID, clients, sortedClients) {
  allID.forEach(id => {
    correctClient = clients.find(client => client.id === id);
    if (correctClient) {
      sortedClients.push(correctClient);
    };
  })    
}

function findClientsByDate(howDate, allDates, clients, sortedClients) {
  allDates.forEach(date => {
    let correctClient;
    if (howDate === 'createdAt') {
      correctClient = clients.find(client => Date.parse(client.createdAt) === date);
    } else if (howDate === 'updatedAt') {
      correctClient = clients.find(client => Date.parse(client.updatedAt) === date);
    }
    
    if (correctClient) {
      sortedClients.push(correctClient);
    };
  })
}
