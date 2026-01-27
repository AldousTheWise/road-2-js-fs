const formParser = async (context, next) => {
  const contentType = context.request.headers["content-type"] || "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    let body = "";
    for await (const chunk of context.request) {
      body += chunk;
    }

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
