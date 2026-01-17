const API_KEYS_VALIDAS = ["12345", "abcde"];

module.exports = function auth(req, res) {
  const apiKey = req.headers["x-api-key"];

  if (!API_KEYS_VALIDAS.includes(apiKey)) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "API key inválida o ausente" }));
    return false;
  }
  return true;
};
