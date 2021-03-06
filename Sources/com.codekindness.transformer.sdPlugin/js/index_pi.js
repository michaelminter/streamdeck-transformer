// this is our global websocket, used to communicate from/to Stream Deck software
// and some info about our plugin, as sent by Stream Deck software
var websocket = null,
  uuid = null,
  actionInfo = {};

function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
  uuid = inUUID;
  // please note: the incoming arguments are of type STRING, so
  // in case of the inActionInfo, we must parse it into JSON first
  actionInfo = JSON.parse(inActionInfo); // cache the info
  websocket = new WebSocket('ws://localhost:' + inPort);

  // if connection was established, the websocket sends
  // an 'onopen' event, where we need to register our PI
  websocket.onopen = function () {
    var json = {
      event:  inRegisterEvent,
      uuid:   inUUID
    };
    // register property inspector to Stream Deck
    websocket.send(JSON.stringify(json));
  }
}

// Passes values to the plugin
function sendValueToPlugin(value, param) {
  let results = { 'sdpi_collection': true }
  const arrElements = document.querySelectorAll('.sdpi-item-value');

  arrElements.forEach((e,i) => {
    results[e.name] = e.value;
  });

  if (websocket) {
    const json = {
      "action": actionInfo['action'],
      "event": "sendToPlugin",
      "context": uuid,
      "payload": results
    };
    websocket.send(JSON.stringify(json));
  }
}
