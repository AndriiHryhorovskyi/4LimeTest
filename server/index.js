const http = require("http");
const url = require("url");
const router = require("./router");
const getBody = require("./getBody");
const { serveStatic } = require("./actions");

const PORT = process.env.PORT || 3000;

http
  .createServer(handleRequest)
  .listen(PORT)
  .on("clientError", (err, socket) => {
    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
  });

async function handleRequest(req, res) {
  const { pathname } = url.parse(req.url, true);

  // CORS
  const origin = req.headers.origin || "*";
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method !== "GET" && req.method !== "POST") {
    res.writeHead(404);
    return res.end();
  }
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const handler = router[req.method][path] || serveStatic;
  let body = {};

  try {
    body = await getBody(req);
  } catch (err) {
    console.error(err);
    return req.destroy();
  }

  try {
    let { status = 200, data, headers = {} } = handler(path, body);
    res.writeHead(status, headers);
    return data ? res.end(data) : res.end();
  } catch (err) {
    res.writeHead(500);
    res.end();
    console.error(
      new Date().toUTCString() + " Internal server error: ",
      err.message,
    );
    console.error(err.stack);
  }
}

process.on("unhandledRejection", err => {
  console.error(
    new Date().toUTCString() + " unhandledRejection: ",
    err.message,
  );
  console.error(err.stack);
  process.exit(1);
});

process.on("uncaughtException", function(err) {
  console.error(new Date().toUTCString() + " uncaughtException: ", err.message);
  console.error(err.stack);
  process.exit(1);
});
