// middleware.js - Middleware común
const fs = require("fs").promises;
const path = require("path");

// Middleware de logging
function logger(context, next) {
  const timestamp = new Date().toISOString();
  const { method, url } = context.request;
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
}

// Middleware CORS
function cors(context, next) {
  const { response } = context;
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
}

// Middleware para parsear JSON
async function jsonParser(context, next) {
  const { request } = context;

  if (
    request.headers["content-type"] === "application/json" &&
    (request.method === "POST" || request.method === "PUT")
  ) {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk.toString();
    });

    request.on("end", () => {
      try {
        context.body = body ? JSON.parse(body) : {};
        next();
      } catch (error) {
        context.response.writeHead(400, { "Content-Type": "application/json" });
        context.response.end(JSON.stringify({ error: "JSON inválido" }));
      }
    });
  } else {
    next();
  }
}

// Middleware para servir archivos estáticos
async function staticFiles(context, next) {
  const { request, response } = context;
  const parsedUrl = url.parse(request.url);
  const pathname = parsedUrl.pathname;

  // Solo servir archivos de /public/
  if (pathname.startsWith("/static/")) {
    const filePath = path.join(__dirname, "public", pathname);

    try {
      const stat = await fs.stat(filePath);

      if (stat.isFile()) {
        const ext = path.extname(filePath);
        const contentType = getContentType(ext);

        response.writeHead(200, { "Content-Type": contentType });

        const stream = fs.createReadStream(filePath);
        stream.pipe(response);
        return;
      }
    } catch (error) {
      console.log(`Archivo no encontrado: ${filePath}`);
    }
  }
  next();
}

function getContentType(ext) {
  const types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };

  return types[ext] || "text/plain";
}

module.exports = {
  logger,
  cors,
  jsonParser,
  staticFiles,
};
