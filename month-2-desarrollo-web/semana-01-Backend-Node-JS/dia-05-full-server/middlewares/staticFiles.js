// middlewares/staticFiles.js
const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

function getContentType(ext) {
  const types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".txt": "text/plain",
  };
  return types[ext] || "application/octet-stream";
}

async function staticFiles(context, next) {
  const { request, response } = context;

  // Usar URL del contexto si existe, o crear uno
  const baseUrl = `http://${request.headers.host || "localhost"}`;
  const urlObj = context.url || new URL(request.url, baseUrl);
  const pathname = urlObj.pathname;

  if (pathname.startsWith("/static/")) {
    const filePath = path.join(__dirname, "../public", pathname);

    try {
      const stat = await fsPromises.stat(filePath);

      if (stat.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = getContentType(ext);

        response.writeHead(200, {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400",
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(response);
        return;
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        response.writeHead(404, { "Content-Type": "text/plain" });
        return response.end("Archivo estatico no encontrado");
      }

      console.error("Error sirviendo archivo estatico:", error);
      response.writeHead(500, { "Content-Type": "text/plain" });
      return response.end("Error interno del servidor");
    }
  }

  next();
}

module.exports = staticFiles;
