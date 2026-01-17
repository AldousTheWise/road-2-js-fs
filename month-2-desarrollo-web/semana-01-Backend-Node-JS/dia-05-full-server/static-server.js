// static-server.js - Servidor optimizado de archivos estáticos
const fs = require("fs").promises;
const path = require("path");
const url = require("url");
const { createReadStream } = require("fs");

class StaticServer {
  constructor(publicPath = "./public") {
    this.publicPath = publicPath;
    this.cache = new Map();
    this.mimeTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
      ".txt": "text/plain",
    };
  }

  // Servir archivo estático
  async serve(request, response) {
    const pathname = request.url;

    if (!pathname.startsWith("/static/")) {
      return false;
    }

    const relativePath = pathname.substring(1);
    const filePath = path.join(__dirname, "public", relativePath);

    try {
      const content = await fs.readFile(filePath);

      // Determinar Content-Type
      const ext = path.extname(filePath).toLowerCase();
      let contentType = "application/octet-stream";

      if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      else if (ext === ".png") contentType = "image/png";
      else if (ext === ".webp") contentType = "image/webp";
      else if (ext === ".gif") contentType = "image/gif";
      else if (ext === ".css") contentType = "text/css";
      else if (ext === ".js") contentType = "application/javascript";
      else if (ext === ".html") contentType = "text/html";

      response.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      });

      response.end(content);
      return true;
    } catch (error) {
      console.log(`[STATIC] Error: ${error.code} - ${error.message}`);

      // Para errores 404, enviar respuesta simple
      if (error.code === "ENOENT") {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("404 - File not found");
      } else {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.end("500 - Internal server error");
      }

      return true;
    }
  }

  sendError(response, statusCode, message) {
    if (
      statusCode === 404 &&
      response.getHeader("Content-Type")?.includes("image")
    ) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("404 Image Not Found");
    } else {
      response.writeHead(statusCode, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: message, status: statusCode }));
    }
    return true;
  }

  // Método para preload de archivos críticos
  async preload(files) {
    for (const file of files) {
      const filePath = path.join(this.publicPath, file);
      try {
        const content = await fs.readFile(filePath);
        this.cache.set(file, content);
      } catch (error) {
        console.warn(`No se pudo precargar ${file}:`, error.message);
      }
    }
  }
}

module.exports = StaticServer;
