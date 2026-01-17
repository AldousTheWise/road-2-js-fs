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

  addRoute(method, path, handler) {
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
      handler,
    });
  }

  get(path, handler) {
    this.addRoute("GET", path, handler);
  }

  post(path, handler) {
    this.addRoute("POST", path, handler);
  }

  put(path, handler) {
    this.addRoute("PUT", path, handler);
  }

  delete(path, handler) {
    this.addRoute("DELETE", path, handler);
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
          handler: route.handler,
        };
      }
    }

    return null;
  }

  async execute(context, routeInfo) {
    const { route, params, handler } = routeInfo;

    // Agregar params al contexto
    context.params = params;

    // Función para ejecutar middlewares en cadena
    const executeMiddlewares = async (index) => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index];
        await middleware(context, () => executeMiddlewares(index + 1));
      } else {
        // Ejecutar el handler final
        await handler(context);
      }
    };

    await executeMiddlewares(0);
  }
}

module.exports = Router;
