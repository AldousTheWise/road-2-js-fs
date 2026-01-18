const formParser = async (context, next) => {
  const contentType = context.request.headers["content-type"];

  if (contentType === "application/x-www-form-urlencoded") {
    let body = "";

    for await (const chunk of context.request) {
      body += chunk;
    }

    context.body = Object.fromEntries(new URLSearchParams(body));
  }

  if (next) await next();
};

module.exports = formParser;
