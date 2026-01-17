function cors(context, next) {
  const { response } = context;

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (context.request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  next();
}

module.exports = cors;
