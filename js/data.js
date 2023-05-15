/* exported data */

var data = {
  view: 'form',
  events: [],
  currentEvent: {},
  nextEventId: 1
};

window.addEventListener('beforeunload', function () {
  var eventDataJSON = JSON.stringify(data);
  this.localStorage.setItem('eventData', eventDataJSON);
});

window.addEventListener('pagehide', function () {
  var eventDataJSON = JSON.stringify(data);
  this.localStorage.setItem('eventData', eventDataJSON);
});

var savedData = window.localStorage.getItem('eventData');
if (savedData !== null) {
  data = JSON.parse(savedData);
}
