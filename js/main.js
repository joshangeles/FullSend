var $searchForm = document.querySelector('#searchForm');
var $searchInput = $searchForm.querySelector('#searchInput');
var $previewImage = document.querySelector('#previewImage');
var $eventInfo = document.querySelectorAll('.data-placeholder');
function searchHandler(event, name) {
  event.preventDefault();
  name = $searchInput.value;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=r3mO1M5MAEVbprAB3NakjYfqW8q0obAh&sort=date,asc&keyword=' + name);
  xhr.responseType = 'json';
  xhr.send();
  xhr.addEventListener('load', function () {
    data.currentEvent.name = xhr.response._embedded.events[0].name;
    data.currentEvent.eventURL = xhr.response._embedded.events[0].url;
    data.currentEvent.date = xhr.response._embedded.events[0].dates.start.localDate;
    data.currentEvent.venue = xhr.response._embedded.events[0]._embedded.venues[0].name;
    data.currentEvent.address = xhr.response._embedded.events[0]._embedded.venues[0].address.line1 + ', ' + xhr.response._embedded.events[0]._embedded.venues[0].city.name + ', ' + xhr.response._embedded.events[0]._embedded.venues[0].state.stateCode;
    data.currentEvent.imageURL = xhr.response._embedded.events[0].images[0].url;
    data.currentEvent.artist = xhr.response._embedded.events[0]._embedded.attractions[0].name;
    $previewImage.setAttribute('src', data.currentEvent.imageURL);
    function setVisible(index) {
      if ($eventInfo[index].tagName === 'P') {
        $eventInfo[index].className = 'data-placeholder text-black text-end visible';
      }
      if ($eventInfo[index].tagName === 'A') {
        $eventInfo[index].className = 'data-placeholder text-decoration-none float-end visible';
      }
    }
    for (var i = 0; i < $eventInfo.length; i++) {
      if ($eventInfo[i].tagName === 'P') {
        if ($eventInfo[i].textContent === 'artistPlaceholder') {
          $eventInfo[i].textContent = data.currentEvent.artist;
        }
        if ($eventInfo[i].textContent === 'venuePlaceholder') {
          $eventInfo[i].textContent = data.currentEvent.venue;
        }
        if ($eventInfo[i].textContent === 'addressPlaceholder') {
          $eventInfo[i].textContent = data.currentEvent.address;
        }
        if ($eventInfo[i].textContent === 'datePlaceholder') {
          $eventInfo[i].textContent = data.currentEvent.date;
        }
      } else if ($eventInfo[i].tagName === 'A') {
        $eventInfo[i].textContent = data.currentEvent.name;
        $eventInfo[i].setAttribute('href', data.currentEvent.eventURL);
      }
      setVisible(i);
    }
  });
}

$searchForm.addEventListener('submit', searchHandler);
