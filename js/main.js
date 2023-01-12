var $searchForm = document.querySelector('#searchForm');
var $searchInput = $searchForm.querySelector('#searchInput');

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
  });
}

$searchForm.addEventListener('submit', searchHandler);
