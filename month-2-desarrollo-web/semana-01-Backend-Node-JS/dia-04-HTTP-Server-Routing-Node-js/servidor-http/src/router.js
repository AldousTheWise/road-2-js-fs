const url = require("url");
const fs = require("fs").promises;
const path = require("path");

const { enviarJSON, enviarHTML } = require("./utils/response");
const { obtenerCuerpo } = require("./utils/body");

const tareasCtrl = require("./controllers/tareas.controller");
const statsCtrl = require("./controllers/stats.controller");

const logger = require("./middlewares/logger");
const auth = require("./middlewares/auth");

// public está FUERA de src
const publicPath = path.join(__dirname, "..", "public");

async function router(req, res) {
  // ===== LOGGER =====
  logger(req);

  const { pathname, query } = url.parse(req.url, true);
  const method = req.method;

  // ===== AUTH PARA API =====
  if (pathname.startsWith("/api")) {
    const autorizado = auth(req, res);
    if (!autorizado) return;
  }

  // ===== ARCHIVOS ESTÁTICOS =====

  // CSS
  if (method === "GET" && pathname.startsWith("/css/")) {
    const cssPath = path.join(publicPath, pathname);

    try {
      const css = await fs.readFile(cssPath, "utf8");
      res.writeHead(200, { "Content-Type": "text/css" });
      return res.end(css);
    } catch {
      return enviarJSON(res, { error: "CSS no encontrado" }, 404);
    }
  }

  // JS
  if (method === "GET" && pathname.startsWith("/js/")) {
    const jsPath = path.join(publicPath, pathname);

    try {
      const js = await fs.readFile(jsPath, "utf8");
      res.writeHead(200, { "Content-Type": "application/javascript" });
      return res.end(js);
    } catch {
      return enviarJSON(res, { error: "JS no encontrado" }, 404);
    }
  }

  // HTML principal
  if (method === "GET" && pathname === "/") {
    const htmlPath = path.join(publicPath, "index.html");
    const html = await fs.readFile(htmlPath, "utf8");
    return enviarHTML(res, html);
  }

  // ===== API =====

  // GET /api/tareas
  if (method === "GET" && pathname === "/api/tareas") {
    return tareasCtrl.listar(res, query, enviarJSON);
  }

  // GET /api/tareas/:id
  if (method === "GET" && pathname.startsWith("/api/tareas/")) {
    const id = Number(pathname.split("/")[3]);

    if (Number.isNaN(id)) {
      return enviarJSON(res, { error: "ID inválido" }, 400);
    }

    return tareasCtrl.obtenerPorId(res, id, enviarJSON);
  }

  // POST /api/tareas
  if (method === "POST" && pathname === "/api/tareas") {
    const data = await obtenerCuerpo(req);
    return tareasCtrl.crear(res, data, enviarJSON);
  }

  // DELETE /api/tareas/:id
  if (method === "DELETE" && pathname.startsWith("/api/tareas/")) {
    const id = Number(pathname.split("/")[3]);

    if (Number.isNaN(id)) {
      return enviarJSON(res, { error: "ID inválido" }, 400);
    }

    return tareasCtrl.eliminar(res, id, enviarJSON);
  }

  // GET /api/stats
  if (method === "GET" && pathname === "/api/stats") {
    return statsCtrl.obtenerStats(res, enviarJSON);
  }

  // ===== 404 =====
  enviarJSON(
    res,
    {
      error: "Ruta no encontrada",
      metodo: method,
      ruta: pathname,
    },
    404
  );
}

module.exports = router;
