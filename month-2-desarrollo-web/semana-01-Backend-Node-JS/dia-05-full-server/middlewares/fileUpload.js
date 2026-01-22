const Busboy = require("busboy");
const path = require("path");
const fs = require("fs");

const fileUpload = async (context, next) => {
  const { request } = context;
  const contentType = request.headers["content-type"];

  if (
    request.method === "POST" &&
    contentType &&
    contentType.includes("multipart/form-data")
  ) {
    return new Promise((resolve, reject) => {
      const busboy = Busboy({ headers: request.headers });
      context.body = {};
      let writingFiles = []; // Para trackear las escrituras activas

      busboy.on("field", (name, val) => {
        context.body[name] = val;
      });

      busboy.on("file", (name, file, info) => {
        const { filename, mimeType } = info;
        // Limpiamos el nombre para evitar caracteres raros
        const finalName = `${Date.now()}-${filename.replace(/\s+/g, "_")}`;
        const saveTo = path.join(
          __dirname,
          "../public/static/images",
          finalName,
        );

        context.file = {
          filename: finalName, // Ahora coincide con tu server.js
          mimeType,
        };

        const writeStream = fs.createWriteStream(saveTo);
        file.pipe(writeStream);

        // Creamos una promesa por cada archivo que se está escribiendo
        const promise = new Promise((res, rej) => {
          writeStream.on("finish", res);
          writeStream.on("error", rej);
        });
        writingFiles.push(promise);
      });

      busboy.on("finish", async () => {
        try {
          // ESPERAMOS a que todas las escrituras a disco terminen de verdad
          await Promise.all(writingFiles);
          if (next) await next();
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      busboy.on("error", (err) => reject(err));
      request.pipe(busboy);
    });
  } else {
    if (next) return next();
  }
};

module.exports = fileUpload;
