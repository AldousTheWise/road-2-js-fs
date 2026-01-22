const formParser = async (context, next) => {
  const contentType = context.request.headers["content-type"] || "";

  // Solo procesamos si no se ha procesado el body antes y es el tipo correcto
  if (contentType.includes("application/x-www-form-urlencoded")) {
    let body = "";
    for await (const chunk of context.request) {
      body += chunk;
    }
    // Decodificar correctamente caracteres especiales
    const params = new URLSearchParams(body);
    const data = {};
    for (const [key, value] of params) {
      data[key] = value;
    }
    context.body = data;
  }

  if (next) await next();
};

module.exports = formParser;
