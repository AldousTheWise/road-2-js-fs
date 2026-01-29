const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const i18next = require("i18next");
const middlewareI118n = require("i18next-http-middleware");
const Joi = require("joi");

// Crear aplicación
const app = express();

// Caché de 60s por default
const myCache = new NodeCache({ stdTTL: 60 });

// Configuración i18n (Internacionalización)
i18next.use(middlewareI118n.LanguageDetector).init({
  fallbackLng: "es",
  resources: {
    en: {
      translation: {
        "error.auth": "Authentication token required",
        "error.invalid_token": "Invalid token",
        "error.rate_limit": "Too many request, please try again later",
        "error.not_found": "Route not found",
        "error.forbidden": "Insufficient permissions",
      },
    },
    es: {
      translation: {
        "error.auth": "Token de autenticación requerido",
        "error.invalid_token": "Token inválido",
        "error.rate_limit": "Demasiadas peticiones, intenta más tarde",
        "error.not_found": "Ruta no encontrada",
        "error.forbidden": "Permisos insuficientes",
      },
    },
  },
});

app.use(middlewareI118n.handle(i18next));

// Middleware de terceros
app.use(helmet()); // Seguridad
app.use(cors()); // CORS
app.use(compression()); // Compresión
app.use(express.json({ limit: "10mb" })); // Parsear JSON
app.use(express.urlencoded({ extended: true }));

// BBDD simulada
let usuarios = [
  { id: 1, nombre: "Ana García", email: "ana@example.com", activo: true },
  { id: 2, nombre: "Carlos López", email: "carlos@example.com", activo: true },
  {
    id: 3,
    nombre: "María Rodríguez",
    email: "maria@example.com",
    activo: false,
  },
];

let productos = [
  { id: 1, nombre: "Laptop", precio: 1200, categoria: "Electrónica", stock: 5 },
  { id: 2, nombre: "Mouse", precio: 25, categoria: "Accesorios", stock: 20 },
  { id: 3, nombre: "Teclado", precio: 75, categoria: "Accesorios", stock: 15 },
];

// Middleware: Timestamp y Logger
app.use((req, res, next) => {
  res.locals.timestamp = new Date().toISOString();
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${res.locals.timestamp}] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`,
    );
  });
  next();
});

// HELPERS DE MIDDLEWARE
const crearLimiter = (minutos, max) =>
  rateLimit({
    windowMs: minutos * 60 * 1000,
    max: max,
    handler: (req, res) => {
      res.status(429).json({
        error: req.t("error.rate_limit"),
        timestamp: res.locals.timestamp,
      });
    },
  });

const cacheMiddleware = (seconds) => (req, res, next) => {
  if (req.method !== "GET") return next();
  const key = `__express__${req.originalUrl || req.url}`;
  const cachedResponse = myCache.get(key);

  if (cachedResponse)
    return res.json({
      ...cachedResponse,
      _fromCache: true,
    });

  res.originalSend = res.json;
  res.json = (body) => {
    if (res.statusCode === 200) {
      myCache.set(key, body, seconds);
    }
    res.originalSend(body);
  };
  next();
};

const validarConJoi = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      error: "Error de validación",
      detalles: error.details.map((d) => d.message),
      timestamp: res.locals.timestamp,
    });
  }

  next();
};

// Esquemas de usuarios y productos
const usuarioSchema = Joi.object({
  nombre: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  activo: Joi.boolean().default(true),
});

const productoSchema = Joi.object({
  nombre: Joi.string().min(2).required(),
  precio: Joi.number().positive().required(),
  categoria: Joi.string().required(),
  stock: Joi.number().integer().min(0),
});

// Lógica de AUTH
function validarAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: req.t("error.auth"),
      timestamp: res.locals.timestamp,
    });
  }

  if (authHeader.substring(7) !== "mi-token-secreto") {
    return res.status(401).json({
      error: req.t("error.invalid_token"),
      timestamp: res.locals.timestamp,
    });
  }
  req.usuario = { id: 1, nombre: "Admin", role: "admin" };
  next();
}

function validarPermisos(permisoRequerido) {
  return (req, res, next) => {
    const permisos = {
      1: ["leer", "escribir", "admin"],
    };

    const misPermisos = permisos[req.usuario.id] || [];

    if (!misPermisos.includes(permisoRequerido)) {
      return res.status(403).json({
        error: req.t("error.forbidden"),
        timestamp: res.locals.timestamp,
      });
    }
    next();
  };
}

// Rutas
app.get("/", (req, res) => {
  res.json({
    mensaje: "API Completa con Extensiones",
    timestamp: res.locals.timestamp,
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: res.locals.timestamp,
  });
});

app.post("/auth/login", crearLimiter(15, 5), (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@example.com" && password === "admin123") {
    res.json({
      token: "mi-token-secreto",
      timestamp: res.locals.timestamp,
    });
  } else {
    res.status(401).json({
      error: "Credenciales inválidas",
    });
  }
});

app.get("/api/usuarios", validarAuth, cacheMiddleware(60), (req, res) => {
  res.json({
    usuarios,
    total: usuarios.length,
    timestamp: res.locals.timestamp,
  });
});

app.post(
  "/api/usuarios",
  validarAuth,
  validarPermisos("escribir"),
  validarConJoi(usuarioSchema),
  (req, res) => {
    const nuevoUsuario = {
      id: usuarios.length + 1,
      ...req.body,
      fechaCreacion: res.locals.timestamp,
    };
    usuarios.push(nuevoUsuario);
    myCache.del("__express__/api/usuarios");
    res.status(201).json({
      mensaje: req.t("msg.user_created"),
      usuario: nuevoUsuario,
    });
  },
);

app.get("/api/productos", validarAuth, cacheMiddleware(30), (req, res) => {
  const { categoria, precio_min, precio_max } = req.query;

  // Definición de reglas de filtrado
  const filtros = [
    { condicion: categoria, operacion: (p) => p.categoria === categoria },
    {
      condicion: precio_min,
      operacion: (p) => p.precio >= parseFloat(precio_min),
    },
    {
      condicion: precio_max,
      operacion: (p) => p.precio <= parseFloat(precio_max),
    },
  ];

  const resultados = productos.filter((producto) =>
    filtros.every((f) => !f.condicion || f.operacion(producto)),
  );

  res.json({
    productos: resultados,
    total: resultados.length,
    timestamp: res.locals.timestamp,
  });
});

app.post(
  "/api/productos",
  validarAuth,
  validarPermisos("escribir"),
  validarConJoi(productoSchema),
  (req, res) => {
    const nuevoProducto = {
      id: productos.length + 1,
      ...req.body,
      fechaCreacion: res.locals.timestamp,
    };

    productos.push(nuevoProducto);
    myCache.del("__express__/api/productos");

    res.status(201).json({
      mensaje: req.t("msg.prod_created"),
      producto: nuevoProducto,
    });
  },
);

// Manejo de errores (extendido)
app.use((error, req, res, next) => {
  console.error("Error:", error);

  res.status(500).json({
    error: "Error interno del server",
    mensaje:
      process.env.NODE_ENV === "developent" ? error.message : "Algo salió mal",
    timestamp: res.locals.timestamp,
  });
});

app.use((req, res) => {
  res
    .status(404)
    .json({ error: req.t("error.not_found"), timestamp: res.locals.timestamp });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `API Express con Middleware Completo en http://localhost:${PORT}`,
  );
  console.log(`Documentación en http://localhost:${PORT}`);
  console.log(
    `Autenticación: POST /auth/login con {"email":"admin@example.com","password":"admin123"}`,
  );
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nCerrando servidor...");
  process.exit(0);
});

module.exports = app;
