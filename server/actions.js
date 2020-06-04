const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const DAL = require("./clicksDAL");

const MIME_TYPES = {
  html: "text/html; charset=UTF-8",
  js: "application/javascript; charset=UTF-8",
  css: "text/css",
  png: "image/png",
  ico: "image/x-icon",
  svg: "image/svg+xml",
  otf: "font/otf",
  ttf: "font/ttf",
  eot: "application/vnd.ms-fontobject",
  woff: "font/woff",
  woff2: "font/woff2",
};
const STATIC_PATH = path.join(__dirname, "static");
const STATIC_PATH_LENGTH = STATIC_PATH.length;
const cache = new Map();

function cacheFile(filePath) {
  const key = filePath.substring(STATIC_PATH_LENGTH);
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = zlib.gzipSync(dataBuffer);
    cache.set(key, data);
  } catch (err) {
    console.error("Cant't read file", err);
    if (err.code !== "ENOENT") throw err;
  }
}

function cacheDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directoryPath, file.name);
    if (file.isDirectory()) cacheDirectory(filePath);
    else cacheFile(filePath);
  }

  fs.watch(directoryPath, (event, fileName) => {
    const filePath = path.join(directoryPath, fileName);
    cacheFile(filePath);
  });
}

cacheDirectory(STATIC_PATH);

module.exports = {
  get_clicks() {
    const clicks = DAL.getAllClicks();
    return { data: JSON.stringify(clicks) };
  },

  save(pathname, body) {
    // validation ommited
    DAL.save(body);
    return {};
  },

  serveStatic(pathname) {
    console.log(pathname)
    const res = { status: 404, data: "", headers: {} };
    const WEB_SEP = "/";
    const platformPath = pathname.split(WEB_SEP).join(path.sep);
    const filePath =
      platformPath === path.sep
        ? path.join(path.sep, "index.html")
        : platformPath.slice(0, -1);

    const fileExt = path.extname(filePath).substring(1);
    const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
    const file = cache.get(filePath);
    const headers = { "Content-Type": mimeType, "Content-Encoding": "gzip" };

    if (file) {
      res.status = 200;
      res.data = file;
      res.headers = headers;
    }

    return res;
  },
};
