// server.js

// === IMPORTACION ===

const http = require("http");
const fs = require("fs");
const fsPromise = fs.promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Router = require("./router.js");
const TemplateEngine = require("./templates.js");
const StaticServer = require("./static-server.js");
const middlewares = require("./middlewares");
const { authService } = require("./middlewares/auth.js");

const router = new Router();
const templates = new TemplateEngine();
const staticServer = new StaticServer();

// ===  MIDDLEWARES GLOBALES ===

router.use(middlewares.logger);
router.use(middlewares.cors);
router.use(middlewares.jsonParser);
router.use(middlewares.formParser);
router.use(middlewares.fileUpload);
router.use(middlewares.staticFiles);
router.use(middlewares.sessions);

// === GESTIÓN DE PRODUCTOS ===
const productosPath = path.join(__dirname, "data", "productos.json");
let productos = [];

// Función única para leer los productos
function cargarProductos() {
  try {
    const data = fs.readFileSync(productosPath, "utf8");
    productos = JSON.parse(data);
    console.log(`[SISTEMA] Productos en memoria: ${productos.length}`);
    return productos;
  } catch (error) {
    console.error("Error al leer productos.json", error.message);
  }
}

cargarProductos();

// === GESTIÓN USUARIOS ===

const usuariosPath = path.join(__dirname, "data", "users.json");
let usuarios = [];

function cargarUsuarios() {
  try {
    const data = fs.readFileSync(usuariosPath, "utf8");
    usuarios = JSON.parse(data);
    console.log(`[SISTEMA] Usuarios en memoria: ${usuarios.length}`);
    return usuarios;
  } catch (error) {
    console.error("Error al leer users.json", error.message);
    return [];
  }
}

cargarUsuarios();

// Helper para datos de autenticación
function getAuthData(context) {
  const session = context.session;
  const rol = session ? session.rol : null;

  return {
    session: session,
    esAdmin: rol === "admin",
    esUsuario: rol === "usuario",
    noAuth: !session,
    haySesion: !!session,
  };
}

// Helper para alertas
function prepareAlert(queryOrObject) {
  if (!queryOrObject) return { alerta: false };

  let tipo = null;
  let mensajeFinal = "";

  const esExito =
    queryOrObject.success === "true" ||
    queryOrObject.registered === "true" ||
    queryOrObject.logout === "true";

  // Evaluamos si existe el parámetro error
  const esError =
    queryOrObject.error === "true" ||
    queryOrObject.error ||
    queryOrObject.tipo === "error";

  if (esExito) {
    tipo = "success";
    const mensajesPersonalizados = {
      Eliminado: "Producto eliminado exitosamente",
      Editado: "Edición del producto ejecutada",
      Creado: "Producto ingresado exitosamente",
      RegistroExitoso: "Cuenta creada exitosamente",
      SesionCerrada: "Has cerrado sesión correctamente",
      RolActualizado: "Usuario actualizado exitosamente",
      UsuarioEliminado: "Usuario eliminado exitosamente",
    };

    let clave = queryOrObject.mensaje;
    if (queryOrObject.registered === "true") clave = "RegistroExitoso";
    if (queryOrObject.logout === "true") clave = "SesionCerrada";

    mensajeFinal =
      mensajesPersonalizados[clave] || clave || "Operación ejecutada";
  } else if (esError) {
    tipo = "error";
    const erroresPersonalizados = {
      LoginError: "Email o contraseña incorrectos",
      AuthRequerida: "Debes iniciar sesión para acceder",
      Falta_Imagen: "Debes subir una imagen para el producto",
      PasswordNotFound: "Debes ingresar contraseña para confirmar",
      NoCambioDeRol: "No puedes cambiar tu rol",
      UserNoEncontrado: "Usuario no encontrado",
      NoAutoEliminacion: "No puedes eliminar tu propia cuenta",
      ErrorAlEliminar: "No se pudo eliminar el usuario",
    };

    // CORRECCIÓN AQUÍ:
    // Si 'mensaje' existe en la URL, lo usamos. Si no, usamos 'error' siempre que no sea "true".
    let claveError = queryOrObject.mensaje;
    if (!claveError || claveError === "true") {
      claveError = queryOrObject.error;
    }

    mensajeFinal =
      erroresPersonalizados[claveError] ||
      (claveError !== "true" ? claveError : "Ha ocurrido un error");
  }

  if (!tipo) return { alerta: false };

  return {
    alerta: true,
    alerta_tipo: tipo,
    alerta_titulo: tipo === "success" ? "CONFIRMACIÓN" : "ATENCIÓN",
    alerta_mensaje: mensajeFinal,
    alerta_es_success: tipo === "success",
    alerta_es_error: tipo === "error",
  };
}

// Helper para construir datos de template
function buildTemplateData(context, extraData = {}) {
  return {
    ...getAuthData(context),
    ...prepareAlert(context.query),
    ...extraData,
  };
}

// === RUTAS PÚBLICAS ===

// Página principal
router.get("/", async (context) => {
  const templateData = buildTemplateData(context, {
    titulo: "Bienvenido a Mi Tienda",
    productos: productos.slice(0, 3),
    fecha: new Date().toLocaleDateString("es-ES"),
  });

  const html = await templates.render("home", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// Lista de productos
router.get("/productos", async (context) => {
  const { query } = context;

  let productosFiltrados = [...productos];
  const filtroAplicado = query.categoria || query.maxPrecio || query.ordenar;

  if (query.categoria) {
    productosFiltrados = productosFiltrados.filter(
      (p) => p.categoria === query.categoria,
    );
  }

  if (query.maxPrecio) {
    const maxPrecio = parseFloat(query.maxPrecio);
    productosFiltrados = productosFiltrados.filter(
      (p) => p.precio <= maxPrecio,
    );
  }

  if (query.ordenar === "precio_asc") {
    productosFiltrados.sort((a, b) => a.precio - b.precio);
  } else if (query.ordenar === "precio_desc") {
    productosFiltrados.sort((a, b) => b.precio - a.precio);
  }

  const templateData = buildTemplateData(context, {
    titulo: "Nuestros Productos",
    productos: productosFiltrados,
    productosCount: productosFiltrados.length,
    tieneProductos: productosFiltrados.length > 0,
    filtroAplicado: !!filtroAplicado,
    query: query,
  });

  const html = await templates.render("productos", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// Detalle de producto
router.get("/productos/:id", async (context) => {
  const { params } = context;
  const id = params.id;
  const session = context.session || {};

  // 1. CARGAR SIEMPRE DESDE EL ARCHIVO
  // Esto asegura que veas las reseñas recién publicadas
  const productosActualizados = cargarProductos();
  const producto = productosActualizados.find((p) => p.id === id);

  if (!producto) {
    const templateData = buildTemplateData(context, {
      titulo: "Producto no encontrado",
    });
    const html = await templates.render("404", templateData);
    context.response.writeHead(404, { "Content-Type": "text/html" });
    context.response.end(html);
    return;
  }

  // 2. PROCESAR REVIEWS
  const reviews = (producto.reviews || []).map((r) => {
    // Validamos permisos
    const esAdmin = session.rol === "admin";
    const esDueno = session.userId && r.usuarioId === session.userId;

    return {
      ...r,
      estrellas: "★".repeat(r.rating) + "☆".repeat(5 - r.rating),
      // Para tu TemplateEngine, enviamos "true" como string o vacío
      puedeBorrar: esAdmin || esDueno ? "true" : "",
      // Inyectamos el ID del producto en cada review para evitar el uso de ../
      parentId: producto.id,
    };
  });

  // 3. CALCULAR PROMEDIO
  let promedio = 0;
  let estrellasPromedio = "☆☆☆☆☆";

  if (reviews.length > 0) {
    const suma = reviews.reduce((acc, r) => acc + r.rating, 0);
    promedio = (suma / reviews.length).toFixed(1);
    const numEstrellas = Math.round(parseFloat(promedio));
    estrellasPromedio = "★".repeat(numEstrellas) + "☆".repeat(5 - numEstrellas);
  }

  // 4. PREPARAR DATA PARA EL MOTOR
  const templateData = buildTemplateData(context, {
    titulo: producto.nombre,
    producto: producto,
    listaReviews: reviews,
    promedioRating: promedio,
    estrellasPromedio: estrellasPromedio,
    totalReviews: reviews.length,
    session: session,
  });

  // >>> AQUÍ ES EL LUGAR ESPECÍFICO PARA EL LOG <<<
  console.log("--- DEBUG START ---");
  console.log("¿Hay sesión?:", !!session.nombre);
  console.log("Rol de sesión:", session.rol);
  // Solo vemos la primera review para no inundar la terminal
  if (templateData.listaReviews.length > 0) {
    console.log("Datos de la primera Review:", {
      usuario: templateData.listaReviews[0].usuario,
      puedeBorrar: templateData.listaReviews[0].puedeBorrar, // Debería decir "true"
      parentId: templateData.listaReviews[0].parentId,
    });
  }
  console.log("--- DEBUG END ---");

  const html = await templates.render("producto-detalle", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

router.post("/productos/review/:id", async (context) => {
  const { id } = context.params;
  const { rating, comentario, nombreInvitado, emailInvitado } = context.body;
  const session = context.session || {};

  // Datos de sesión > Datos de formulario (guest)
  const autorNombre = session.nombre || nombreInvitado;
  const autorEmail = session.email || emailInvitado;
  const autorId = session.userId || null;

  if (!autorNombre || !autorEmail) {
    context.response.writeHead(302, {
      Location: `/productos/${id}?error=IdentificacionRequerida`,
    });
    return context.response.end();
  }

  const productos = cargarProductos();
  const index = productos.findIndex((p) => p.id == id);

  if (index !== -1) {
    if (!productos[index].reviews) productos[index].reviews = [];

    productos[index].reviews.push({
      id: Date.now(),
      usuarioId: autorId,
      usuario: autorNombre,
      email: autorEmail,
      rating: parseInt(rating),
      comentario: comentario,
      fecha: new Date().toLocaleDateString("es-ES"),
    });

    await fsPromise.writeFile(
      productosPath,
      JSON.stringify(productos, null, 2),
    );
  }

  context.response.writeHead(302, { Location: `/productos/${id}` });
  context.response.end();
});

router.post("/productos/eliminar-review/:prodId/:reviewId", async (context) => {
  const { prodId, reviewId } = context.params;
  const session = context.session || {};

  const productos = cargarProductos();
  const prodIndex = productos.findIndex((p) => p.id == prodId);

  if (prodIndex !== -1) {
    const reviewIndex = productos[prodIndex].reviews.findIndex(
      (r) => r.id == reviewId,
    );
    const review = productos[prodIndex].reviews[reviewIndex];

    const esAdmin = session.rol === "admin";
    const esDueno = review.usuarioId && review.usuarioId === session.userId;

    if (esAdmin || esDueno) {
      productos[prodIndex].reviews.splice(reviewIndex, 1);
      await fsPromise.writeFile(
        productosPath,
        JSON.stringify(productos, null, 2),
      );
      context.response.writeHead(302, {
        Location: `/productos/${prodId}?success=Eliminado`,
      });
    } else {
      context.response.writeHead(302, {
        Location: `/productos/${prodId}?error=NoPermitido`,
      });
    }
  }
  context.response.end();
});

// Acerca de
router.get("/about", async (context) => {
  const templateData = buildTemplateData(context, {
    titulo: "Acerca de Nosotros",
    empresa: "Mi Tienda Online",
    descripcion:
      "Somos una empresa dedicada a ofrecer los mejores productos desde 2020.",
    fundacion: 2020,
  });

  const html = await templates.render("about", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// === API PÚBLICA ===

router.get("/api/productos", (context) => {
  const { query } = context;
  let resultados = productos;

  if (query.categoria) {
    resultados = resultados.filter((p) => p.categoria === query.categoria);
  }

  if (query.minPrecio) {
    const minPrecio = parseFloat(query.minPrecio);
    resultados = resultados.filter((p) => p.precio >= minPrecio);
  }

  if (query.maxPrecio) {
    const maxPrecio = parseFloat(query.maxPrecio);
    resultados = resultados.filter((p) => p.precio <= maxPrecio);
  }

  if (query.ordenar === "precio_asc") {
    resultados.sort((a, b) => a.precio - b.precio);
  } else if (query.ordenar === "precio_desc") {
    resultados.sort((a, b) => b.precio - a.precio);
  }

  const pagina = parseInt(query.pagina) || 1;
  const limite = parseInt(query.limite) || 10;
  const inicio = (pagina - 1) * limite;
  const paginados = resultados.slice(inicio, inicio + limite);

  context.response.writeHead(200, { "Content-Type": "application/json" });
  context.response.end(
    JSON.stringify({
      total: resultados.length,
      pagina,
      limite,
      productos: paginados,
    }),
  );
});

router.get("/api/productos/:id", (context) => {
  const { params } = context;
  const id = params.id;
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    context.response.writeHead(404, { "Content-Type": "application/json" });
    context.response.end(JSON.stringify({ error: "Producto no encontrado." }));
    return;
  }

  context.response.writeHead(200, { "Content-Type": "application/json" });
  context.response.end(JSON.stringify(producto));
});

// API Usuarios
router.get("/api/admin/usuarios", (context) => {
  const auth = getAuthData(context);
  if (!auth.esAdmin) {
    context.response.writeHead(403);
    return context.response.end(JSON.stringify({ error: "Acceso denegado" }));
  }

  context.response.end(JSON.stringify(usuarios));
});

// === AUTENTICACIÓN Y LOGIN ===

// Login - GET
router.get("/login", async (context) => {
  if (context.session) {
    context.response.writeHead(302, { Location: "/" });
    context.response.end();
    return;
  }

  const templateData = buildTemplateData(context, {
    titulo: "Iniciar sesión",
  });

  const html = await templates.render("login", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// Login - POST
router.post("/login", async (context) => {
  if (context.session) {
    context.response.writeHead(302, { Location: "/" });
    context.response.end();
    return;
  }

  const { email, password } = context.body;

  try {
    const user = await authService.authenticate(email, password);

    if (!user) {
      const templateData = buildTemplateData(context, {
        titulo: "Iniciar Sesión",
        ...prepareAlert({ error: "LoginError" }),
      });

      const html = await templates.render("login", templateData);
      context.response.writeHead(401, { "Content-Type": "text/html" });
      return context.response.end(html);
    }

    const { sessionId } = context.sessionManager.createSession({
      id: user.id,
      nombre: user.nombre,
      rol: user.rol,
      email: user.email,
    });

    const cookie = `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`;

    context.response.writeHead(302, {
      Location: "/",
      "Set-Cookie": cookie,
    });
    context.response.end();
  } catch (error) {
    console.error("Error en login:", error);
    const templateData = buildTemplateData(context, {
      titulo: "Iniciar Sesión",
    });

    const html = await templates.render("login", templateData);
    context.response.writeHead(500, { "Content-Type": "text/html" });
    context.response.end(html);
  }
});

// Logout
router.get("/logout", async (context) => {
  const cookieHeader = context.request.headers.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split("=");
      acc[name] = value;
      return acc;
    }, {});

    const sessionId = cookies.sessionId;
    if (sessionId && context.sessionManager) {
      context.sessionManager.destroySession(sessionId);
    }
  }

  const cookie = `sessionId=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;

  context.response.writeHead(302, {
    Location: "/?logout=true",
    "Set-Cookie": cookie,
  });
  context.response.end();
});

// Perfil
router.get("/perfil", async (context) => {
  if (!context.session) {
    context.response.writeHead(302, { Location: "/login" });
    context.response.end();
    return;
  }

  const nombre = context.session.nombre || "Usuario";
  const templateData = buildTemplateData(context, {
    titulo: "Mi Perfil",
    inicialNombre: nombre.charAt(0).toUpperCase(),
    fechaActual: new Date().toLocaleDateString("es-ES"),
  });

  const html = await templates.render("profile", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// Editar perfil
router.post("/perfil/actualizar", async (context) => {
  if (!context.session) {
    context.response.writeHead(302, { Location: "/login" });
    return context.response.end();
  }

  const { nombre, email, passwordActual, passwordNueva } = context.body;
  const userId = context.session.id;

  const user = await authService.findUserById(userId);

  if (!user) return context.response.end("Usuario no encontrado");

  const isCurrentValid = await authService.validatePassword(
    passwordActual || "",
    user.password,
  );

  if (!isCurrentValid) {
    context.response.writeHead(302, {
      Location: "/perfil?error=true&mensaje=PasswordNotFound",
    });
    return context.response.end();
  }

  const index = authService.users.findIndex((u) => u.id == userId);

  if (index !== -1) {
    authService.users[index].nombre = nombre.trim();
    authService.users[index].email = email.trim().toLowerCase();

    if (passwordNueva && passwordNueva.trim().length > 0) {
      authService.users[index].password =
        await authService.hashPassword(passwordNueva);
    }

    await authService.saveUsers();

    context.session.nombre = authService.users[index].nombre;
    context.session.email = authService.users[index].email;
    context.response.writeHead(302, {
      Location: "/perfil?success=true&mensaje=Perfil actualizado",
    });
    context.response.end();
  } else {
    context.response.end("Error crítico: Usuario no encontrado");
  }
});

// === REGISTRO ===

// Registro - GET
router.get("/register", async (context) => {
  if (context.session) {
    context.response.writeHead(302, { Location: "/" });
    context.response.end();
    return;
  }

  const templateData = buildTemplateData(context, {
    titulo: "Crear Cuenta",
    formData: {},
  });

  const html = await templates.render("register", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// Registro - POST
router.post("/register", async (context) => {
  const { nombre, email, password, confirmPassword } = context.body;

  try {
    if (password !== confirmPassword) {
      throw new Error("Las contraseñas no coinciden");
    }

    await authService.registerUser({
      nombre,
      email,
      password,
    });

    context.response.writeHead(302, {
      Location: "/login?registered=true",
    });
    context.response.end();
  } catch (error) {
    const templateData = buildTemplateData(context, {
      titulo: "Crear Cuenta",
      error: error.message,
      formData: { nombre, email },
      ...prepareAlert({ error: error.message }),
    });

    const html = await templates.render("register", templateData);
    context.response.writeHead(400, { "Content-Type": "text/html" });
    context.response.end(html);
  }
});

// === ADMIN ===

// Listar productos en el panel
router.get("/admin", async (context) => {
  const auth = getAuthData(context);
  if (!auth.esAdmin) {
    context.response.writeHead(302, { Location: "/login?error=AuthRequerida" });
    return context.response.end();
  }

  const listaProductos = cargarProductos();
  const listaUsuarios = cargarUsuarios();

  const templateData = buildTemplateData(context, {
    titulo: "Panel de Administración",
    listaProductos: [...listaProductos].reverse(),
    totalProductos: listaProductos.length,
    listaUsuarios: listaUsuarios,
    totalUsuarios: listaUsuarios.length,
    nombreAdmin: context.session.nombre,
    fecha: new Date().toLocaleDateString("es-ES"),
  });

  const html = await templates.render("admin", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// === ADMIN/PRODUCTOS ===

// Agregar producto nuevo
router.post("/admin/productos", async (context) => {
  const { nombre, precio, categoria, descripcion } = context.body;
  if (!context.file) {
    context.response.writeHead(302, { Location: "/admin?error=Falta_Imagen" });
    context.response.end();
  }

  const nuevo = {
    id: uuidv4(),
    nombre,
    categoria: categoria || "Varios",
    descripcion: descripcion || "",
    precio: parseFloat(precio) || 0,
    imagen: `/static/images/${context.file.filename}`,
    fechaCarga: new Date().toISOString(),
  };

  productos.push(nuevo);
  await fsPromise.writeFile(productosPath, JSON.stringify(productos, null, 2));
  context.response.writeHead(302, {
    Location: "/admin?success=true&mensaje=Creado",
  });
  context.response.end();
});

// Editar producto existente desde dashboard de admin
router.post("/admin/productos/editar/:id", async (context) => {
  const { id } = context.params;
  const { nombre, precio, categoria } = context.body;

  const index = productos.findIndex((p) => p.id === id);
  if (index !== -1) {
    productos[index].nombre = nombre;
    productos[index].categoria = categoria;
    productos[index].precio = parseFloat(precio);
    await fsPromise.writeFile(
      productosPath,
      JSON.stringify(productos, null, 2),
    );
  }
  context.response.writeHead(302, {
    Location: "/admin?success=true&mensaje=Editado",
  });
  context.response.end();
});

// Editar producto desde la página de descripción del producto
router.post("/admin/productos/editar-completo/:id", async (context) => {
  const { id } = context.params;
  const { nombre, precio, categoria, descripcion } = context.body;

  const index = productos.findIndex((p) => p.id === id);
  if (index != -1) {
    productos[index].nombre = nombre;
    productos[index].precio = parseFloat(precio);
    productos[index].categoria = categoria;
    productos[index].descripcion = descripcion;

    if (context.file) {
      productos[index].imagen = `/static/images/${context.file.filename}`;
    }

    await fsPromise.writeFile(
      productosPath,
      JSON.stringify(productos, null, 2),
    );
  }

  context.response.writeHead(302, {
    Location: `/productos/${id}?success=true`,
  });
  context.response.end();
});

// Eliminar producto
router.post("/admin/productos/eliminar/:id", async (context) => {
  const { id } = context.params;
  productos = productos.filter((p) => p.id !== id);

  await fsPromise.writeFile(productosPath, JSON.stringify(productos, null, 2));
  console.log(`[ELIMINAR] Producto removido: ${id}`);

  context.response.writeHead(302, {
    Location: "/admin?success=true&mensaje=Eliminado",
  });
  context.response.end();
});

// === ADMIN/USUARIOS ===

// Lista de usuarios
router.get("/admin/usuarios", async (context) => {
  if (!getAuthData(context).esAdmin) {
    context.response.writeHead(302, { Location: "/login?error=AuthRequerida" });
    return context.response.end();
  }

  const usuarios = cargarUsuarios();
  const templateData = buildTemplateData(context, {
    titulo: "Gestión de Usuarios",
    usuarios: usuarios,
    totalUsuarios: usuarios.length,
  });

  const html = await templates.render("admin-usuarios", templateData);
  context.response.writeHead(200, { "Content-Type": "text/html" });
  context.response.end(html);
});

// Editar usuario desde admin
router.post("/admin/usuarios/editar/:id", async (context) => {
  const id = parseInt(context.params.id, 10);
  const { rol } = context.body;
  const sesionActual = context.session;

  if (id === sesionActual.userId) {
    context.response.writeHead(302, {
      Location: "/admin?tab=usuarios&error=true&mensaje=NoCambioDeRol",
    });
    return context.response.end();
  }

  const usuarios = cargarUsuarios();
  const index = usuarios.findIndex((u) => u.id === id);

  if (index !== -1) {
    usuarios[index].rol = rol;
    await fsPromise.writeFile(usuariosPath, JSON.stringify(usuarios, null, 2));

    context.response.writeHead(302, {
      Location: "/admin?tab=usuarios&success=true&mensaje=RolActualizado",
    });
  } else {
    context.response.writeHead(302, {
      Location: "/admin?tab=usuarios&error=true&mensaje=UserNoEncontrado",
    });
  }
  context.response.end();
});

// Eliminar usuario desde admin
router.post("/admin/usuarios/eliminar/:id", async (context) => {
  const id = parseInt(context.params.id, 10);
  const sesionActual = context.session;

  if (id === sesionActual.userId) {
    context.response.writeHead(302, {
      Location: "/admin?tab=usuarios&error=true&mensaje=NoAutoEliminacion",
    });
    return context.response.end();
  }

  let usuarios = cargarUsuarios();
  const existe = usuarios.some((u) => u.id === id);

  if (existe) {
    usuarios = usuarios.filter((u) => u.id !== id);
    await fsPromise.writeFile(usuariosPath, JSON.stringify(usuarios, null, 2));

    context.response.writeHead(302, {
      Location: "/admin?tab=usuarios&success=true&mensaje=UsuarioEliminado",
    });
  } else {
    context.response.writeHead(302, {
      Location: "/admin?tab=usuarios&error=true&mensaje=ErrorAlEliminar",
    });
  }
  context.response.end();
});

// === SERVER ===

// Helper para server
const servidor = http.createServer(async (request, response) => {
  const { method } = request;

  try {
    const baseUrl = `http://${request.headers.host || "localhost"}`;
    const urlObj = new URL(request.url, baseUrl);
    const pathname = urlObj.pathname;

    const query = {};
    urlObj.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    const context = {
      request,
      response,
      query,
      params: {},
      body: {},
      user: null,
    };

    const archivoServido = await staticServer.serve(
      request,
      response,
      pathname,
    );
    if (archivoServido) return;

    const routeInfo = router.findRoute(method, pathname);

    if (routeInfo) {
      context.params = routeInfo.params;
      await router.execute(context, routeInfo);
    } else {
      const templateData = buildTemplateData(context, {
        titulo: "Página no encontrada",
        mensaje: `La ruta ${pathname} no existe.`,
      });

      const html = await templates.render("404", templateData);
      response.writeHead(404, { "Content-Type": "text/html" });
      response.end(html);
    }
  } catch (error) {
    console.error("Error en el servidor:", error);

    const html = await templates.render("error", {
      titulo: "Error del servidor",
      mensaje: "Ha ocurrido un error interno.",
      error: process.env.NODE_ENV === "development" ? error.message : "",
      session: null,
      esAdmin: false,
      noSesion: true,
      haySesion: false,
    });

    response.writeHead(500, { "Content-Type": "text/html" });
    response.end(html);
  }
});

// === Funcionamiento Server ===

async function iniciarServidor() {
  try {
    await staticServer.preload(["static/css/styles.css", "static/js/app.js"]);

    const PUERTO = process.env.PORT || 3000;
    servidor.listen(PUERTO, async () => {
      console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
      console.log(`Home: http://localhost:${PUERTO}`);
      console.log(`Productos: http://localhost:${PUERTO}/productos`);
      console.log(`Login: http://localhost:${PUERTO}/login`);
      console.log(`Perfil: http://localhost:${PUERTO}/perfil`);
      console.log(`Admin: http://localhost:${PUERTO}/admin`);
      console.log(`API: http://localhost:${PUERTO}/api/productos`);
      console.log(`=======================================`);
      console.log(`Credenciales de prueba:`);
      console.log(`admin@tienda.com / admin123`);
      console.log(`usuario@tienda.com / usuario123`);
      console.log(`=======================================`);
    });
  } catch (error) {
    console.error("Error al iniciar:", error);
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  console.log("\nCerrando servidor...");
  servidor.close(() => {
    console.log("Servidor cerrado correctamente");
    process.exit(0);
  });
});

if (require.main === module) {
  iniciarServidor();
}
