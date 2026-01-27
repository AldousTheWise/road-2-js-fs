const fs = require("fs").promises;
const path = require("path");

class StaticServer {
  constructor() {
    this.cache = new Map(); // Para no leer el disco mil veces
    this.mimeTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
    };
  }

  async serve(request, response, parsedPathName) {
    const pathname =
      parsedPathName ||
      new URL(request.url, `http://request.headers.host`).pathname;

    if (this.cache.has(pathname)) {
      const { content, contentType } = this.cache.get(pathname);
      this.sendResponse(response, 200, contentType, content);
      return true;
    }

    let filePath;

    if (pathname.startsWith("/static/")) {
      filePath = path.join(process.cwd(), "public", pathname);
    } else if (pathname.startsWith("/uploads/")) {
      filePath = path.join(process.cwd(), pathname);
    } else {
      return false;
    }

    try {
      const content = await fs.readFile(path.normalize(filePath));
      const ext = path.extname(filePath).toLowerCase();
      const contentType = this.mimeTypes[ext] || "application/octet-stream";

      if (pathname.startsWith("/static/")) {
        this.cache.set(pathname, { content, contentType });
      }

      this.sendResponse(response, 200, contentType, content);
      return true;
    } catch (error) {
      if (error.code === "ENOENT") {
        return this.sendError(response, 404, "File not found");
      }
      return this.sendError(response, 500, "Server Error");
    }
  }

  sendResponse(response, statusCode, contentType, content) {
    response.writeHead(statusCode, {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(content);
  }

  sendError(response, statusCode, message) {
    response.writeHead(statusCode, { "Content-Type": "text/plain" });
    response.end(`${statusCode} - ${message}`);
    return true;
  }

  async preload(files) {
    for (const file of files) {
      // El file debe venir como '/static/css/base.css'
      const filePath = path.join(process.cwd(), "public", file);
      try {
        const content = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        this.cache.set(file, {
          content,
          contentType: this.mimeTypes[ext],
        });
        console.log(`[PRELOAD] Cache listo: ${file}`);
      } catch (error) {
        console.warn(`[PRELOAD] Error en ${file}:`, error.message);
      }
    }
  }
}

module.exports = StaticServer;
