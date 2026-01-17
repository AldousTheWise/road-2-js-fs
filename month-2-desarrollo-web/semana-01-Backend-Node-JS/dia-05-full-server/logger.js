module.exports = function logger(context) {
  const timestamp = new Date().toISOString();
  const { method, url } = context.request;

  console.log(`${timestamp} ${method} ${url}`);
};
