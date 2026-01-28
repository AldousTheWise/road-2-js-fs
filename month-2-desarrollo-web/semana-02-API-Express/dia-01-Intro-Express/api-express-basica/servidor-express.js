// servidor-express.js (server express básico)

// importar express
const express = require("express");

const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const Joi = require("joi");
const { Parser } = require("json2csv");

// Crear aplicación
const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" },
);

// Middleware para parsing JSON
app.use(express.json());

app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));

// BBDD simulada
let tareas = [
  {
    id: 1,
    titulo: "Aprender Express",
    descripcion: "Completar tutorial",
    completada: false,
  },
  {
    id: 2,
    titulo: "Crear API",
    descripcion: "Implementar endpoints REST",
    completada: true,
  },
  {
    id: 3,
    titulo: "Testing",
    descripcion: "Probar con Postman",
    completada: false,
  },
];

let siguienteId = 4;

// Funciones helper
const encontrarTarea = (id) => {
  return tareas.find((t) => t.id === parseInt(id));
};

const tareaSchema = Joi.object({
  titulo: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El título no puede estar vacío",
    "string.min": "El título debe tener al menos 3 caracteres",
    "any.required": "El título es obligatorio",
  }),
  descripcion: Joi.string().allow("", null),
  completada: Joi.boolean().default(false),
});

// Rutas de la API

// GET / - Informacion de la API
app.get("/", (req, res) => {
  res.json({
    mensaje: "API de Gestión de Tareas con Express.js",
    version: "1.0.0",
    endpoints: {
      "GET /": "Esta información",
      "GET /tareas": "Listar tareas",
      "GET /tareas/:id": "Obtener tarea específica",
      "POST /tareas": "Crear una nueva tarea",
      "PUT /tareas/:id": "Actualizar tarea completa",
      "PATCH /tareas/:id": "Actualizar tarea parcial",
      "DELETE /tareas/:id": "Eliminar tarea",
    },
    ejemplo: {
      crear:
        'POST /tareas con body: {"titulo": "Mi tarea", "descripción": "Descripción"}',
      filtrar: "GET /tareas?completada=false",
      buscar: "GET /tareas?q=express",
    },
  });
});

// GET /tareas - listar todas las tareas
app.get("/tareas", (req, res) => {
  let resultados = [...tareas];
  const { completada, q, ordenar } = req.query;

  // Filtrar por estado
  if (completada !== undefined) {
    const filtroCompletada = completada === "true";
    resultados = resultados.filter((t) => t.completada === filtroCompletada);
  }

  // Buscar por texto
  if (q) {
    const termino = q.toLowerCase();
    resultados = resultados.filter(
      (t) =>
        t.titulo.toLowerCase().includes(termino) ||
        t.descripcion.toLowerCase().includes(termino),
    );
  }

  // Ordenar
  if (ordenar === "titulo") {
    resultados.sort((a, b) => a.titulo.localeCompare(b.titulo));
  } else if (ordenar === "fecha") {
    resultados.reverse();
  }

  res.json({
    total: resultados.length,
    tareas: resultados,
    filtros: req.query,
  });
});

// GET /tareas/stats - Estadísticas de las tareas
app.get("/tareas/stats", (req, res) => {
  const totalCompletadas = tareas.filter((t) => t.completada).length;
  const stats = {
    total: tareas.length,
    completadas: totalCompletadas,
    pendientes: tareas.filter((t) => !t.completada).length,
    porcentajeCompletado:
      tareas.length > 0
        ? ((totalCompletadas / tareas.length) * 100).toFixed(2) + "%"
        : 0,
  };
  res.json(stats);
});

// GET /tareas/exportar - exportar a CSV
app.get("/tareas/exportar", (req, res) => {
  try {
    const campos = [
      "id",
      "titulo",
      "descripcion",
      "completada",
      "fechaCreacion",
    ];
    const opts = { fields: campos };
    const parser = new Parser(opts);
    const csv = parser.parse(tareas);

    res.header("Content-Type", "text/csv");
    res.attachment("mis-tareas.csv");
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ error: "Error al generar el archivo CSV" });
  }
});

// GET /tareas/:id - Obtener tarea específica
app.get("/tareas/:id", (req, res) => {
  const tarea = encontrarTarea(req.params.id);

  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  res.json(tarea);
});

// POST /tareas - Crear nueva tarea
app.post("/tareas", (req, res) => {
  const { error, value } = tareaSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: "Validación fallida",
      detalles: error.details.map((d) => d.message),
    });
  }

  const nuevaTarea = {
    id: siguienteId++,
    ...value,
    fechaCreacion: new Date().toISOString(),
  };

  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// PUT /tareas/:id - Actualizar tarea completa
app.put("/tareas/:id", (req, res) => {
  const tarea = encontrarTarea(req.params.id);

  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada " });
  }

  const { error, value } = tareaSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: "Datos inválidos",
      detalles: error.details.map((d) => d.message),
    });
  }

  // Actualización completa
  tarea.titulo = value.titulo;
  tarea.descripcion = value.descripcion || "";
  tarea.completada = value.completada || false;
  tarea.fechaActualizacion = new Date().toISOString();

  res.json({
    mensaje: "Tarea actualizada completamente",
    tarea,
  });
});

// PATCH /tareas/:id - Actualizar tarea parcial
app.patch("/tareas/:id", (req, res) => {
  const tarea = encontrarTarea(req.params.id);

  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  const esquemaParcial = tareaSchema.fork(["titulo"], (schema) =>
    schema.optional(),
  );

  const { error, value } = esquemaParcial.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      error: "Validación parcial fallida",
      detalles: error.details.map((d) => d.message),
    });
  }

  if (value.titulo !== undefined) tarea.titulo = value.titulo;
  if (value.descripcion !== undefined) tarea.descripcion = value.descripcion;
  if (value.completada !== undefined) tarea.completada = value.completada;

  tarea.fechaActualizacion = new Date().toISOString();

  res.json({
    mensaje: "Tarea actualizada parcialmente",
    tarea,
  });
});

// DELETE /tareas/:id - Eliminar tarea
app.delete("/tareas/:id", (req, res) => {
  const indice = tareas.findIndex((t) => t.id === parseInt(req.params.id));

  if (indice === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  const tareaEliminada = tareas.splice(indice, 1)[0];

  res.json({
    mensaje: "Tarea eliminada exitosamente",
    tarea: tareaEliminada,
  });
});

// Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error("Error:", error);

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON inválido" });
  }

  res.status(500).json({
    error: "Error interno del servidor",
    mensaje:
      process.env.NODE_ENV === "development" ? error.message : "Algo salió mal",
  });
});

// Middleware 404
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    metodo: req.method,
    ruta: req.url,
    sugerencias: [
      "GET / - Información de la API",
      "GET /tareas - Listar tareas",
      "POST /tareas - Crear tarea",
    ],
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `API REST con Express.js ejecutándose en http://localhost:${PORT}`,
  );
  console.log(`Documentación en http://localhost:${PORT}`);
  console.log(`Prueba los endpoints con curl o Postman`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nCerrando servidor...");
  process.exit(0);
});
