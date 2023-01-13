/* exported data */

var data = {
  view: 'form',
  events: [],
  currentEvent: {
    artist: null,
    name: null,
    date: null,
    venue: null,
    address: null,
    eventURL: null,
    imageURL: null,
    eventId: null
  },
  nextEventId: 1
};

window.addEventListener('beforeunload', function () {
  var eventDataJSON = JSON.stringify(data);
  this.localStorage.setItem('eventData', eventDataJSON);
});

var savedData = window.localStorage.getItem('eventData');
if (savedData !== null) {
  data = JSON.parse(savedData);
}
