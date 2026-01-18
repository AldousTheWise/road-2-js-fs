// router.js
class Router {
  constructor() {
    this.routes = {
      GET: [],
      POST: [],
      PUT: [],
      DELETE: [],
    };
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  addRoute(method, path, ...handlers) {
    const normalizedMethod = method.toUpperCase();

    if (!this.routes[normalizedMethod]) {
      this.routes[normalizedMethod] = [];
    }

    const paramNames = [];
    const regexPath = path.replace(/:(\w+)/g, (match, paramName) => {
      paramNames.push(paramName);
      return "([^/]+)";
    });

    this.routes[normalizedMethod].push({
      path,
      regex: new RegExp(`^${regexPath}$`),
      paramNames,
      handlers,
    });
  }

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

  findRoute(method, pathname) {
    const methodRoutes = this.routes[method] || [];

    for (const route of methodRoutes) {
      const match = pathname.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });

        return {
          route,
          params,
          handlers: route.handlers,
        };
      }
    }

    return null;
  }

  async execute(context, routeInfo) {
    const { route, params, handlers } = routeInfo;

    // Agregar params al contexto
    context.params = params;

    // Combinar middlewares globales con los específicos de la ruta
    const allHandlers = [...this.middlewares, ...handlers];

    // Función para ejecutar handlers en cadena
    const executeHandlers = async (index) => {
      if (index < allHandlers.length) {
        const handler = allHandlers[index];

        // Si el handler espera 2 params (context, next), es middleware
        if (handler.length === 2) {
          await handler(context, () => executeHandlers(index + 1));
        } else {
          // Si espera 1 param, es handlers final
          await handler(context);
        }
      }
    };

    await executeHandlers(0);
  }
}

module.exports = Router;
