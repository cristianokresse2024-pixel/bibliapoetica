// Bíblia Poética — servidor estático de desenvolvimento
// Serve os arquivos com os MIME types corretos (inclusive o manifest PWA).
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  if (urlPath === "/") urlPath = "/index.html";

  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end("Forbidden"); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 — não encontrado");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const ctype = MIME[ext] || "application/octet-stream";
    const cache = ext === ".html" || ext === ".webmanifest" ? "no-cache" : "public, max-age=3600";
    res.writeHead(200, { "Content-Type": ctype, "Cache-Control": cache });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Bíblia Poética servida em http://${HOST}:${PORT}`);
});
