const test = require("node:test");
const assert = require("node:assert");
const TemplateEngine = require("../templates.js");

// === LÓGICA DE NEGOCIO ==
test("Cálculo de promedio de calificaciones", () => {
  const reviews = [{ rating: 5 }, { rating: 4 }, { rating: 3 }];

  const suma = reviews.reduce((acc, r) => acc + r.rating, 0);
  const promedio = (suma / reviews.length).toFixed(1);

  assert.strictEqual(promedio, "4.0", "El promedio debería ser 4.0");
});

// === MOTOR DE PLANTILLAS ===
test("TemplateEngine: Procesar condicionales #if", async () => {
  const engine = new TemplateEngine();
  const template = "Hola {{#if mostrar}}Mundo{{/if}}";

  // Caso 1: mostrar es true
  const htmlTrue = engine.procesarCondicionales(template, { mostrar: "true" });
  assert.match(htmlTrue, /Mundo/, "Debería contener 'Mundo' cuando es true");

  // Caso 2: mostrar es falso/vacío
  const htmlFalse = engine.procesarCondicionales(template, { mostrar: "" });
  assert.strictEqual(
    htmlFalse,
    "Hola ",
    "Debería estar vacío cuando mostrar es falso o está vacío",
  );
});

test("TemplateEngine: Procesar bucles #each", async () => {
  const engine = new TemplateEngine();
  const template = "{{#each items}}{{this}},{{/each}}";
  const data = { items: ["A", "B", "C"] };

  const html = engine.procesarVariablesYEach(template, data);
  assert.strictEqual(
    html,
    "A,B,C,",
    "Debería renderizar la lista separada por comas",
  );
});

test("Edge Case: Review con rating 0 debe afectar al promedio", () => {
  const reviews = [{ rating: 5 }, { rating: 0 }];

  const suma = reviews.reduce((acc, r) => acc + r.rating, 0);
  const promedio = (suma / reviews.length).toFixed(1);

  assert.strictEqual(promedio, "2.5", "El promedio con un 0 debería ser 2.5");
});

test("Integración: El servidor debe responder 404 para productos inexistentes ", async () => {
  try {
    const response = await fetch("http://localhost:3000/productos/id-falso");

    assert.strictEqual(response.status, 404, "Debería retornar un código 404");
  } catch (error) {
    // Si el servidor no está encendido, el fetch fallará
    console.log("Asegúrate de tener el servidor corriendo en el puerto 3000");
    assert.fail("No se pudo conectar con el servidor");
  }
});
