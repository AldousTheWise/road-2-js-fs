const http = require("http");
const router = require("./router");

const server = http.createServer((req, res) => {
  router(req, res).catch((err) => {
    console.error(err);
    res.writeHead(500);
    res.end("Error interno");
  });
});

server.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
  console.log("Documentación en http://localhost:3000");
  console.log("Prueba los endpoints con curl o tu navegador");
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nCerrando servidor...");
  server.close(() => {
    console.log("Servidor cerrado correctamente");
    process.exit(0);
  });
});
