// templates.js
const fs = require("fs").promises;
const path = require("path");

class TemplateEngine {
  constructor(viewsPath = "./views") {
    this.viewsPath = viewsPath;
  }

  async render(templateName, data = {}) {
    const layoutPath = path.join(this.viewsPath, "layout.html");
    let html = await fs.readFile(layoutPath, "utf8");

    const templatePath = path.join(this.viewsPath, `${templateName}.html`);
    const content = await fs.readFile(templatePath, "utf8");

    // 1. Inyectar contenido en el layout
    html = html.replace("{{content}}", content);

    // 2. Procesar la lógica de control (IF / UNLESS)
    html = this.procesarCondicionales(html, data);

    // 3. Procesar bucles y variables finales
    html = this.procesarVariablesYEach(html, data);

    return html;
  }

  procesarCondicionales(html, data) {
    // Regex para detectar {{#if variable}}...{{/if}}
    // Soporta multilínea [\s\S]*?
    const regexIf = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
    const regexUnless = /\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/g;

    let resultado = html;

    // Procesar IFs
    resultado = resultado.replace(regexIf, (match, variable, contenido) => {
      return data[variable] ? this.procesarCondicionales(contenido, data) : "";
    });

    // Procesar UNLESS
    resultado = resultado.replace(regexUnless, (match, variable, contenido) => {
      return !data[variable] ? this.procesarCondicionales(contenido, data) : "";
    });

    return resultado;
  }

  procesarVariablesYEach(html, data) {
    // Procesar {{#each}}
    let resultado = html.replace(
      /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
      (match, arrayName, contenido) => {
        const array = data[arrayName];
        if (!Array.isArray(array)) return "";

        return array
          .map((item) => {
            let itemHtml = contenido;
            return itemHtml.replace(/\{\{([\w\.]+)\}\}/g, (m, key) => {
              return this.obtenerValor(item, key);
            });
          })
          .join("");
      },
    );

    // Procesar variables globales del objeto data
    resultado = resultado.replace(/\{\{([\w\.]+)\}\}/g, (match, key) => {
      // Evitamos procesar {{content}} si por alguna razón sigue ahí
      if (key === "content") return match;
      return this.obtenerValor(data, key);
    });

    return resultado;
  }

  obtenerValor(obj, key) {
    if (key.includes(".")) {
      return key.split(".").reduce((o, i) => (o ? o[i] : ""), obj) || "";
    }
    return obj[key] !== undefined ? String(obj[key]) : "";
  }
}

module.exports = TemplateEngine;
