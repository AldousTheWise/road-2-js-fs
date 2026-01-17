// router.js
const url = require("url");

class Router {
  constructor() {
    this.routes = {};
    this.middlewares = [];
  }

  // Agregar middleware global
  use(middleware) {
    this.middlewares.push(middleware);
  }

  //  Registrar rutas con diferentes métodos
  addRoute(method, path, ...handlers) {
    if (!this.routes[method]) {
      this.routes[method] = [];
    }

    // Convertir path con params a regex
    const paramNames = [];
    const regexPath = path.replace(/:(\w+)/g, (match, paramName) => {
      paramNames.push(paramName);
      return "([^/]+)";
    });

    this.routes[method].push({
      originalPath: path,
      regex: new RegExp(`^${regexPath}$`),
      paramNames,
      handlers,
    });
  }

  // Metodos
  get(path, ...handlers) {
    this.addRoute("GET", path, ...handlers);
  }

  post(path, ...handlers) {
    this.addRoute("POST", path, ...handlers);
  }

  put(path, ...handlers) {
    this.addRoute("PUT", path, ...handlers);
  }

  delete(path, ...handlers) {
    this.addRoute("DELETE", path, ...handlers);
  }

  // Encontrar ruta que coincida
  findRoute(method, pathname) {
    const methodRoutes = this.routes[method];
    if (!methodRoutes) return null;

    for (const route of methodRoutes) {
      const match = pathname.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });

        return { route, params };
      }
    }
    return null;
  }

  // Ejecutar middlewares y handlers
  async execute(request, response, routeInfo) {
    const { route, params } = routeInfo;

    // Crear contexto
    const context = {
      request,
      response,
      params,
      query: url.parse(request.url, true).query,
      body: null,
    };

    // Función para ejecutar handlers
    const runHandlers = async () => {
      for (const handler of route.handlers) {
        const result = await handler(context);
        if (result === "next") continue;
        if (result !== undefined) return result;
      }
    };

    // Función para ejecutar middlewares en cadena
    const runMiddlewares = async () => {
      // Crear una copia de los middlewares
      const middlewares = [...this.middlewares];

      // Función next recursiva
      const next = async () => {
        if (middlewares.length > 0) {
          const middleware = middlewares.shift();
          await middleware(context, next);
        } else {
          // Todos los middlewares ejecutados, ahora ejecutar handlers
          await runHandlers();
        }
      };

      await next();
    };

    // Iniciar la cadena de middlewares
    await runMiddlewares();
  }
}

module.exports = Router;
