const request = require("supertest");
const app = require("./app-completa-middleware"); // Importa tu archivo principal

async function runTests() {
  console.log("Iniciando pruebas automatizadas...\n");

  // --- TEST 1: Validación Joi (POST Producto) ---
  console.log("Test 1: Validación Joi (Precio negativo)");
  const resJoi = await request(app)
    .post("/api/productos")
    .set("Authorization", "Bearer mi-token-secreto")
    .send({ nombre: "Monitor", precio: -10, categoria: "Hardware" });

  console.log(
    resJoi.status === 400
      ? "Success: Bloqueó precio negativo"
      : "Fail: Falló Joi",
  );
  console.log(`Mensaje: ${resJoi.body.detalles[0]}\n`);

  // --- TEST 2: Internacionalización i18n ---
  console.log("Test 2: i18n (Error en Inglés)");
  const resEn = await request(app)
    .get("/api/usuarios")
    .set("Accept-Language", "en"); // Sin token para forzar error 401

  console.log(
    resEn.body.error === "Authentication token required"
      ? "Success: Error en Inglés"
      : "Fail: Falló i18n",
  );

  // --- TEST 3: Caché (GET Productos) ---
  console.log("\nTest 3: Cache (Detección de segunda respuesta)");
  // Primera petición (va a la lógica)
  await request(app)
    .get("/api/productos")
    .set("Authorization", "Bearer mi-token-secreto");

  // Segunda petición (debe venir de cache)
  const resCache = await request(app)
    .get("/api/productos")
    .set("Authorization", "Bearer mi-token-secreto");

  console.log(
    resCache.body._fromCache
      ? "Success: Datos servidos desde Caché"
      : "Fail: Falló Caché",
  );

  // --- TEST 4: Rate Limiting ---
  console.log("\nTest 4: Rate Limiting (Login excesivo)");
  console.log("Enviando peticiones rápidas a /auth/login...");

  let lastStatus;
  for (let i = 0; i < 6; i++) {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "a@a.com", password: "123" });
    lastStatus = res.status;
  }

  console.log(
    lastStatus === 429
      ? "Success: Rate Limit activado (429)"
      : "Fail: Falló Rate Limit",
  );

  console.log("\n--- Pruebas finalizadas ---");
  process.exit();
}

runTests();
