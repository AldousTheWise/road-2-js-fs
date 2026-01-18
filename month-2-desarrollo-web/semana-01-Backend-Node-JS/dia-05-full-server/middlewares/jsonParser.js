// middlewares/jsonParser.js
async function jsonParser(context, next) {
  const { request } = context;

  if (
    request.headers["content-type"] === "application/json" &&
    (request.method === "POST" ||
      request.method === "PUT" ||
      request.method === "PATCH")
  ) {
    return new Promise((resolve, reject) => {
      let body = "";

      request.on("data", (chunk) => {
        body += chunk.toString();
      });

      request.on("end", () => {
        try {
          context.body = body ? JSON.parse(body) : {};
          next();
          resolve();
        } catch (error) {
          context.response.writeHead(400, {
            "Content-Type": "application/json",
          });
          context.response.end(JSON.stringify({ error: "JSON inválido" }));
          reject(error);
        }
      });

      request.on("error", reject);
    });
  } else {
    next();
  }
}

module.exports = jsonParser;
