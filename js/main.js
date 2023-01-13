var $searchForm = document.querySelector('#searchForm');
var $searchInput = $searchForm.querySelector('#searchInput');
var $previewImage = document.querySelector('#previewImage');
var $eventInfo = document.querySelectorAll('.data-placeholder');
var $fullSendButton = document.querySelector('#fullSendButton');
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
    data.currentEvent.artist = xhr.response._embedded.events[0]._embedded.attractions[0].name;
    data.currentEvent.name = xhr.response._embedded.events[0].name;
    data.currentEvent.date = xhr.response._embedded.events[0].dates.start.localDate;
    data.currentEvent.venue = xhr.response._embedded.events[0]._embedded.venues[0].name;
    data.currentEvent.address = xhr.response._embedded.events[0]._embedded.venues[0].address.line1 + ', ' + xhr.response._embedded.events[0]._embedded.venues[0].city.name + ', ' + xhr.response._embedded.events[0]._embedded.venues[0].state.stateCode;
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
$searchForm.addEventListener('submit', searchHandler);

function fullSendHandler(event) {
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
    $previewImage.setAttribute('src', 'https://www.caliberwealthmanagement.com/images/placeholder-rectangle.png');
    $searchForm.reset();
  }
  data.currentEvent.eventId = data.nextEventId;
  data.nextEventId++;
  data.events.push(data.currentEvent);
  data.currentEvent = {};
}

$fullSendButton.addEventListener('click', fullSendHandler);
