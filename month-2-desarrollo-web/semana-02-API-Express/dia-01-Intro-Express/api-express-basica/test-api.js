const http = require("http");

const peticiones = [
  { path: "/", method: "GET" },
  { path: "/tareas", method: "GET" },
  { path: "/tareas/stats", method: "GET" },
  { path: "/tareas/exportar", method: "GET" },
  {
    path: "/tareas",
    method: "POST",
    body: { titulo: "Tarea de prueba automática" },
  },
  { path: "/ruta-que-no-existe", method: "GET" },
];

console.log("Iniciando pruebas rápidas...");

peticiones.forEach((p) => {
  const options = {
    hostname: "localhost",
    port: 3000,
    path: p.path,
    method: p.method,
    headers: { "Content-Type": "application/json" },
  };

  const req = http.request(options, (res) => {
    console.log(`[${p.method}] ${p.path} -> Status: ${res.statusCode}`);
  });

  if (p.body) req.write(JSON.stringify(p.body));
  req.end();
});
