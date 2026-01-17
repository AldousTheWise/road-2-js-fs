function enviarJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  res.end(JSON.stringify(data, null, 2));
}

function enviarHTML(res, html, statusCode = 200) {
  res.writeHead(statusCode, {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(html);
}

module.exports = { enviarJSON, enviarHTML };
