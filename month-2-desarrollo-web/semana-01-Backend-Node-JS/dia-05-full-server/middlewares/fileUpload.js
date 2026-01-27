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
      let writingFiles = [];

      busboy.on("field", (name, val) => {
        context.body[name] = val;
      });

      busboy.on("file", (name, file, info) => {
        const { filename, mimeType } = info;

        if (!filename) {
          file.resume();
          return;
        }

        const finalName = `${Date.now()}-${filename.replace(/\s+/g, "_")}`;
        const saveTo = path.join(
          __dirname,
          "../public/static/images",
          finalName,
        );

        context.file = {
          filename: finalName,
          mimeType,
        };

        const writeStream = fs.createWriteStream(saveTo);
        file.pipe(writeStream);

        const promise = new Promise((res, rej) => {
          writeStream.on("finish", res);
          writeStream.on("error", rej);
        });
        writingFiles.push(promise);
      });

      busboy.on("finish", async () => {
        try {
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
