// middlewares/staticFiles.js
const fs = require("fs").promises;
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
      const stat = await fs.stat(filePath);

      if (stat.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = getContentType(ext);

        response.writeHead(200, {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400",
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(response);
        return; // NO llamar next()
      }
    } catch (error) {
      // Archivo no encontrado, continuar
    }
  }

  next(); // Pasar al siguiente middleware
}

module.exports = staticFiles;
