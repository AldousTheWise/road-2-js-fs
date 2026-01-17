const fs = require("fs").promises;
const path = require("path");

class TemplateEngine {
  constructor(viewsPath = "./views") {
    this.viewsPath = viewsPath;
  }

  async render(templateName, data = {}) {
    // 1. Leer layout
    const layoutPath = path.join(this.viewsPath, "layout.html");
    let html = await fs.readFile(layoutPath, "utf8");

    // 2. Leer el template específico
    const templatePath = path.join(this.viewsPath, `${templateName}.html`);
    const content = await fs.readFile(templatePath, "utf8");

    // 3. Meter el content dentro del layout
    html = html.replace("{{content}}", content);

    // 4. Procesar el template
    html = this.procesarTemplate(html, data);

    return html;
  }

  procesarTemplate(html, data) {
    // 1. Procesar {{#if condition}}
    html = html.replace(
      /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (match, condition, contenido) => {
        const valor = data[condition];
        if (valor) {
          return this.procesarTemplate(contenido, data);
        }
        return "";
      }
    );

    // 2. Procesar {{#unless condition}}
    html = html.replace(
      /\{\{#unless (\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/g,
      (match, condition, contenido) => {
        const valor = data[condition];
        if (!valor) {
          return this.procesarTemplate(contenido, data);
        }
        return "";
      }
    );

    // 3. Procesar {{#each array}}
    html = html.replace(
      /\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
      (match, arrayName, contenido) => {
        const array = data[arrayName];
        if (!Array.isArray(array)) {
          return "";
        }

        let resultado = "";
        for (const item of array) {
          let itemHtml = contenido;
          // Reemplazar variables dentro del item (pueden ser objeto.propiedad)
          itemHtml = itemHtml.replace(/\{\{([\w\.]+)\}\}/g, (match2, key) => {
            return this.obtenerValor(item, key);
          });
          resultado += itemHtml;
        }
        return resultado;
      }
    );

    // 4. Procesar TODAS las variables {{variable}} o {{objeto.propiedad}}
    html = html.replace(/\{\{([\w\.]+)\}\}/g, (match, key) => {
      return this.obtenerValor(data, key);
    });

    return html;
  }

  // Método auxiliar para obtener valores (simple o objeto.propiedad)
  obtenerValor(obj, key) {
    // Si la key tiene punto (ej: producto.nombre)
    if (key.includes(".")) {
      const partes = key.split(".");
      let valor = obj;
      for (const parte of partes) {
        valor = valor ? valor[parte] : undefined;
      }
      return valor !== undefined ? valor : "";
    }
    // Si es una key simple
    return obj[key] !== undefined ? obj[key] : "";
  }
}

module.exports = TemplateEngine;
