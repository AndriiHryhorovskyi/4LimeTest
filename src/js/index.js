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
    // here can be a WebSocket, localstorage or else
    this.destination = "http://localhost:3000";
  }

  get_clicks() {
    return fetch(`${this.destination}/api/clicks`).then(res => res.json());
  }

  save(data) {
    return fetch(`${this.destination}/api/clicks`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json());
  }
}

const storage = new Storage();

field.onclick = async function(event) {
  const click = new Click(event);
  try {
    await storage.save(click.getInfo());
  } catch (err) {
    // network error or 500
    // add click to que, wait when destination storage will be available
  }
};

listBtn.onclick = async function() {
  const clickList = await storage.get_clicks();
  const clicksView = clickList.reduce(
    (list, item) => list + `<p>${JSON.stringify(item)}</p>`,
    "",
  );
  viewZone.innerHTML = clicksView;
};
