/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
var $searchForm = document.querySelector('#searchForm');
var $searchInput = $searchForm.querySelector('#searchInput');
var $previewImage = document.querySelector('#previewImage');
var $eventInfo = document.querySelectorAll('.data-placeholder');
var $modalLink = document.querySelector('#modalLink');
var $saveButton = document.querySelector('#saveButton');
var $cancelButton = document.querySelector('#cancelButton');
var $fullSendButton = document.querySelector('#fullSendButton');
var $savedEventsLink = document.querySelector('#savedEventsLink');
var $formView = document.querySelector('[data-view="form"]');
var $listView = document.querySelector('[data-view="list"]');
var $saveList = document.querySelector('#saveList');
var $noneSavedMessage = document.querySelector('#no-events');
var $alert = document.querySelector('div.alert');
var validSearch = false;

function toggleVisible(index) {
  if ($eventInfo[index].tagName === 'P') {
    if ($eventInfo[index].className === 'data-placeholder text-black text-end visible') {
      $eventInfo[index].className = 'data text-black text-end invisible';
    } else if ($eventInfo[index].className === 'data-placeholder text-black text-end invisible') {
      $eventInfo[index].className = 'data text-black text-end visible';
    }
  }
  if ($eventInfo[index].getAttribute('id') === 'name') {
    if ($eventInfo[index].className === 'data-placeholder text-decoration-none float-end invisible') {
      $eventInfo[index].className = 'data text-decoration-none float-end visible';
    } else if ($eventInfo[index].className === 'data-placeholder text-decoration-none float-end visible') {
      $eventInfo[index].className = 'data-placeholder text-decoration-none float-end invisible';
    }
  }
}

function searchHandler(event, name) {
  event.preventDefault();
  name = $searchInput.value;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=r3mO1M5MAEVbprAB3NakjYfqW8q0obAh&sort=date,asc&keyword=' + name.replace(' ', '_'));
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (!xhr.response._embedded) {
      $alert.className = 'alert alert-danger';
      return;
    }
    $alert.className = 'alert alert-danger d-none';
    if ('attractions' in xhr.response._embedded.events[0]._embedded) {
      data.currentEvent.artist = xhr.response._embedded.events[0]._embedded.attractions[0].name;
    } else {
      data.currentEvent.artist = 'No artist found! Open mic night?';
    }
    data.currentEvent.name = xhr.response._embedded.events[0].name;
    data.currentEvent.date = xhr.response._embedded.events[0].dates.start.localDate;
    data.currentEvent.venue = xhr.response._embedded.events[0]._embedded.venues[0].name;
    if (xhr.response._embedded.events[0]._embedded.venues[0].country.countryCode === 'US') {
      data.currentEvent.address = xhr.response._embedded.events[0]._embedded.venues[0].address.line1 + ', ' + xhr.response._embedded.events[0]._embedded.venues[0].city.name + ', ' + xhr.response._embedded.events[0]._embedded.venues[0].state.stateCode;
    } else if (xhr.response._embedded.events[0]._embedded.venues[0].country.countryCode !== 'US') {
      data.currentEvent.address = 'Something went wrong, check TicketMaster!';
    }
    data.currentEvent.eventURL = xhr.response._embedded.events[0].url;
    data.currentEvent.imageURL = xhr.response._embedded.events[0].images[0].url;

    $previewImage.setAttribute('src', data.currentEvent.imageURL);
    for (var i = 0; i < $eventInfo.length; i++) {
      if ($eventInfo[i].tagName === 'P') {
        if ($eventInfo[i].getAttribute('id') === 'artist') {
          $eventInfo[i].textContent = data.currentEvent.artist;
        }
        if ($eventInfo[i].getAttribute('id') === 'venue') {
          $eventInfo[i].textContent = data.currentEvent.venue;
        }
        if ($eventInfo[i].getAttribute('id') === 'address') {
          $eventInfo[i].textContent = data.currentEvent.address;
        }
        if ($eventInfo[i].getAttribute('id') === 'date') {
          $eventInfo[i].textContent = data.currentEvent.date;
        }
      }
      if ($eventInfo[i].tagName === 'A') {
        $eventInfo[i].textContent = data.currentEvent.name;
        $eventInfo[i].setAttribute('href', data.currentEvent.eventURL);
      }
      toggleVisible(i);
    }
  });
  xhr.send();
  validSearch = true;
}

function resetInfo() {
  for (var i = 0; i < $eventInfo.length; i++) {
    if ($eventInfo[i].tagName === 'P') {
      if ($eventInfo[i].textContent === data.currentEvent.artist) {
        $eventInfo[i].textContent = '';
      }
      if ($eventInfo[i].textContent === data.currentEvent.venue) {
        $eventInfo[i].textContent = '';
      }
      if ($eventInfo[i].textContent === data.currentEvent.address) {
        $eventInfo[i].textContent = '';
      }
      if ($eventInfo[i].textContent === data.currentEvent.date) {
        $eventInfo[i].textContent = '';
      }
    } else {
      $eventInfo[i].textContent = '';
    }
    if (validSearch === true) {
      toggleVisible(i);
    }
  }
  $previewImage.setAttribute('src', 'https://www.caliberwealthmanagement.com/images/placeholder-rectangle.png');
  $searchForm.reset();
}

function saveHandler(event) {
  resetInfo();
  if (data.currentEvent.artist === undefined) {
    return;
  }
  data.currentEvent.eventId = data.nextEventId;
  data.nextEventId++;
  data.events.push(data.currentEvent);
  $saveList.append(renderSavedEvent(data.currentEvent));
  $noneSavedMessage.className = 'col-12 d-flex px-0 justify-content-around d-none';
  data.currentEvent = {};
}

$searchForm.addEventListener('submit', searchHandler);
$fullSendButton.addEventListener('click', function () {
  if ($searchInput.value.length !== 0) {
    $modalLink.textContent = data.currentEvent.name;
    $modalLink.setAttribute('href', data.currentEvent.eventURL);
  }
});

$saveButton.addEventListener('click', saveHandler);
$cancelButton.addEventListener('click', function () {
  resetInfo();
  data.currentEvent = {};
});

$savedEventsLink.addEventListener('click', function () {
  $formView.className = 'container d-none';
  $listView.className = 'container';
});

let selectedCard = null; // contains the ID of the card that triggered the notes modal

function renderSavedEvent(savedEvent) {
  var $saveListItem = document.createElement('li');
  var $itemCard = document.createElement('div');
  var $itemTitleImageContainer = document.createElement('div');
  var $itemTitleImageRow = document.createElement('div');
  var $itemTitleCol = document.createElement('div');
  var $itemTitle = document.createElement('h4');
  var $savedImage = document.createElement('img');
  var $itemInfoContainer = document.createElement('div');
  var $infoContainerRow = document.createElement('div');
  var $infoContainerCol = document.createElement('div');
  var $infoTitle = document.createElement('h4');
  var $artistRow = document.createElement('div');
  var $artistLabelCol = document.createElement('div');
  var $artistLabel = document.createElement('p');
  var $artistTextCol = document.createElement('div');
  var $artistText = document.createElement('p');
  var $nameRow = document.createElement('div');
  var $nameLabelCol = document.createElement('div');
  var $nameLabel = document.createElement('p');
  var $nameAnchorCol = document.createElement('div');
  var $nameAnchor = document.createElement('a');
  var $venueRow = document.createElement('div');
  var $venueLabelCol = document.createElement('div');
  var $venueLabel = document.createElement('p');
  var $venueTextCol = document.createElement('div');
  var $venueText = document.createElement('p');
  var $addressRow = document.createElement('div');
  var $addressLabelCol = document.createElement('div');
  var $addressLabel = document.createElement('p');
  var $addressTextCol = document.createElement('div');
  var $addressText = document.createElement('p');
  var $dateRow = document.createElement('div');
  var $dateLabelCol = document.createElement('div');
  var $dateLabel = document.createElement('p');
  var $dateTextCol = document.createElement('div');
  var $dateText = document.createElement('p');
  var $addNotesContainer = document.createElement('div');
  var $addNotesButton = document.createElement('button');
  var $notesModalOverlay = document.createElement('div');
  var $notesModalDialogue = document.createElement('div');
  var $notesModalContent = document.createElement('div');
  var $notesModalBody = document.createElement('div');
  var $notesModalForm = document.createElement('form');
  var $notesModalFormContainer = document.createElement('div');
  var $notesModalFormHeaderButtonRow = document.createElement('div');
  var $notesModalFormHeaderColumn = document.createElement('div');
  var $notesModalFormHeader = document.createElement('h5');
  var $notesModalFormButtonColumn = document.createElement('div');
  var $notesModalButton = document.createElement('button');
  var $notesModalFormTextAreaRow = document.createElement('div');
  var $notesModalFormTextAreaColumn = document.createElement('div');
  var $notesModalFormTextArea = document.createElement('textarea');

  $saveListItem.setAttribute('class', 'mb-4');
  $saveListItem.setAttribute('id', 'c' + savedEvent.eventId);
  $itemCard.setAttribute('class', 'card bg-body-secondary border-rounded');
  $itemCard.setAttribute('data-bs-theme', 'dark');
  $itemTitleImageContainer.setAttribute('class', 'container gx-0');
  $itemTitleImageRow.setAttribute('class', 'row');
  $itemTitleCol.setAttribute('class', 'col');
  $itemTitle.setAttribute('class', 'text-black');
  $savedImage.setAttribute('class', 'card-img-top object-fit-cover');
  $savedImage.setAttribute('src', savedEvent.imageURL);
  $itemInfoContainer.setAttribute('class', 'container');
  $infoContainerRow.setAttribute('class', 'row bg-white pt-3 px-1');
  $infoContainerCol.setAttribute('class', 'col');
  $infoTitle.setAttribute('class', 'card-title text-white ps-2 py-3 my-0 d-inline-block');
  $artistRow.setAttribute('class', 'row pt-md-1');
  $artistLabelCol.setAttribute('class', 'col-4');
  $artistTextCol.setAttribute('class', 'col-8');
  $artistText.setAttribute('class', 'text-end');
  $nameRow.setAttribute('class', 'row pt-md-1');
  $nameLabelCol.setAttribute('class', 'col-4');
  $nameAnchorCol.setAttribute('class', 'col-8');
  $nameAnchor.setAttribute('class', 'float-end text-end');
  $nameAnchor.setAttribute('href', savedEvent.eventURL);
  $venueRow.setAttribute('class', 'row pt-md-1');
  $venueLabelCol.setAttribute('class', 'col-4');
  $venueTextCol.setAttribute('class', 'col-8');
  $venueText.setAttribute('class', 'text-end');
  $addressRow.setAttribute('class', 'row pt-md-1');
  $addressLabelCol.setAttribute('class', 'col-4');
  $addressTextCol.setAttribute('class', 'col-8');
  $addressText.setAttribute('class', 'text-end');
  $dateRow.setAttribute('class', 'row pt-md-1');
  $dateLabelCol.setAttribute('class', 'col-4');
  $dateTextCol.setAttribute('class', 'col-8');
  $dateText.setAttribute('class', 'text-end');
  $addNotesContainer.setAttribute('class', 'd-grid gap-0');
  $addNotesButton.setAttribute('class', 'text-white bg-secondary border-0 rounded-bottom');
  $addNotesButton.setAttribute('type', 'button');
  $addNotesButton.setAttribute('id', 'notesModalButton');
  $addNotesButton.setAttribute('data-bs-toggle', 'modal');
  $addNotesButton.setAttribute('data-bs-target', '#notesModal');
  $infoTitle.textContent = savedEvent.name;
  $itemTitle.textContent = 'Event Information:';
  $artistLabel.textContent = 'Artist:';
  $artistText.textContent = savedEvent.artist;
  $nameLabel.textContent = 'Name:';
  $nameAnchor.textContent = savedEvent.name;
  $venueLabel.textContent = 'Venue:';
  $venueText.textContent = savedEvent.venue;
  $addressLabel.textContent = 'Address:';
  $addressText.textContent = savedEvent.address;
  $dateLabel.textContent = 'Date:';
  $dateText.textContent = savedEvent.date;
  $saveListItem.appendChild($itemCard);
  $itemCard.appendChild($itemTitleImageContainer);
  $itemTitleImageContainer.appendChild($itemTitleImageRow);
  $itemTitleImageRow.appendChild($itemTitleCol);
  $itemTitleCol.appendChild($infoTitle);
  $itemCard.appendChild($savedImage);
  $itemCard.appendChild($itemInfoContainer);
  $itemInfoContainer.appendChild($infoContainerRow);
  $infoContainerRow.appendChild($infoContainerCol);
  $infoContainerCol.appendChild($itemTitle);
  $infoContainerCol.appendChild($artistRow);
  $artistRow.appendChild($artistLabelCol);
  $artistLabelCol.appendChild($artistLabel);
  $artistRow.appendChild($artistTextCol);
  $artistTextCol.appendChild($artistText);
  $infoContainerCol.appendChild($nameRow);
  $nameRow.appendChild($nameLabelCol);
  $nameLabelCol.appendChild($nameLabel);
  $nameRow.appendChild($nameAnchorCol);
  $nameAnchorCol.appendChild($nameAnchor);
  $infoContainerCol.appendChild($venueRow);
  $venueRow.appendChild($venueLabelCol);
  $venueLabelCol.appendChild($venueLabel);
  $venueRow.appendChild($venueTextCol);
  $venueTextCol.appendChild($venueText);
  $infoContainerCol.appendChild($addressRow);
  $addressRow.appendChild($addressLabelCol);
  $addressLabelCol.appendChild($addressLabel);
  $addressRow.appendChild($addressTextCol);
  $addressTextCol.appendChild($addressText);
  $infoContainerCol.appendChild($dateRow);
  $dateRow.appendChild($dateLabelCol);
  $dateLabelCol.appendChild($dateLabel);
  $dateRow.appendChild($dateTextCol);
  $dateTextCol.appendChild($dateText);
  $itemCard.appendChild($addNotesContainer);
  $addNotesContainer.appendChild($addNotesButton);
  savedEvent?.notes?.length > 0
    ? $addNotesButton.textContent = 'View Notes'
    : $addNotesButton.textContent = 'Add Notes...';
  $addNotesButton.addEventListener('click', () => {
    selectedCard = savedEvent.eventId;
    if (selectedCard && savedEvent.notes) {
      $notes.value = savedEvent.notes;
    }
  });
  return $saveListItem;
}

window.addEventListener('DOMContentLoaded', function () {
  for (var i = 0; i < data.events.length; i++) {
    var eventDOMTree = renderSavedEvent(data.events[i]);
    $saveList.appendChild(eventDOMTree);
    $noneSavedMessage.className = 'col-12 d-flex px-0 justify-content-around d-none';
    const currentNote = data.events[i].notes;
    if (currentNote) {
      $notes.value = currentNote;
    }
  }
});

var $newButton = document.querySelector('#newButton');
$newButton.addEventListener('click', function () {
  $formView.className = 'container';
  $listView.className = 'container d-none';
});

var $notes = document.querySelector('#notesArea');
var $notesForm = document.querySelector('#notesForm');

$notesForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const foundEvent = data.events.find(card => card.eventId === selectedCard);
  const notesIndex = data.events.findIndex(event => event.eventId === foundEvent.eventId);
  data.events[notesIndex].notes = $notes.value;
  if (selectedCard) {
    const triggeredButton = document.querySelector(`li#c${selectedCard} > div.card > div.d-grid > button`);
    triggeredButton.textContent = 'View Notes';
  }
});
