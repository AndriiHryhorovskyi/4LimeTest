const field = document.getElementById("clickingField");
const listBtn = document.getElementById("listBtn");
const viewZone = document.getElementById("viewZone");

class Click {
  constructor(event) {
    this._event = event;
    this.timestamp = Date.now();
  }
  getInfo() {
    const { target: element, pageX: x, pageY: y } = this._event;
    const coockie = document.cookie
      ? document.cookie.split("; ").find(item => item.startsWith("_ga"))
      : null;
    const elementInfo = {
      id: element.id || null,
      classes: element.className.split(" "),
      type: element.tagName.toLowerCase(),
    };

    return {
      x,
      y,
      element: elementInfo,
      timestamp: this.timestamp,
      gclid: coockie ? coockie.split("=")[1] : null,
      url: window.location.href,
    };
  }
}

class Storage {
  constructor() {
    this.destination = new Set(); // here can be a websocket or http
  }

  get_clicks() {
    return [...this.destination.values()];
  }

  save(data) {
    this.destination.add(data);
    return true;
  }
}

const storage = new Storage();

field.onclick = function(event) {
  const click = new Click(event);
  if (!storage.save(click.getInfo())) {
    // add click to que, wait destination storage will be available
  }
};

listBtn.onclick = function() {
  const clickList = storage
    .get_clicks()
    .reduce((list, item) => ( list + `<p>${JSON.stringify(item)}</p>` ), '');
  viewZone.innerHTML = clickList;
};
