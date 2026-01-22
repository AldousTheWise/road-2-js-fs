// templates.js
const fs = require("fs").promises;
const path = require("path");

class TemplateEngine {
  constructor(viewsPath = "./views") {
    this.viewsPath = viewsPath;
  }

  /**
   * Método principal de renderizado
   */
  async render(templateName, data = {}) {
    try {
      // 1. Cargar Layout
      const layoutPath = path.join(this.viewsPath, "layout.html");
      let html = await fs.readFile(layoutPath, "utf8");

      // 2. Cargar la vista específica
      const templatePath = path.join(this.viewsPath, `${templateName}.html`);
      const content = await fs.readFile(templatePath, "utf8");

      // 3. Inyectar contenido en el layout
      html = html.replace("{{content}}", content);

      // Cargar componentes dinámicos (Partials)
      // Esto busca etiquetas {{componente:nombre}} y las reemplaza por el archivo en /views/components/
      html = await this.cargarComponentes(html);

      // 5. Procesar la lógica de control (IF / UNLESS)
      html = this.procesarCondicionales(html, data);
      html = this.procesarVariablesYEach(html, data);

      return html;
    } catch (error) {
      console.error("Error en TemplateEngine:", error);
      throw error;
    }
  }

  /**
   * Busca y reemplaza etiquetas {{componente:nombre}} por archivos en views/components/
   */
  async cargarComponentes(html) {
    const regexComponente = /\{\{componente:(\w+)\}\}/g;
    let resultado = html;
    let match;

    // Usamos un bucle para procesar todos los componentes encontrados
    while ((match = regexComponente.exec(resultado)) !== null) {
      const etiquetaCompleta = match[0]; // {{componente:toast}}
      const nombreComponente = match[1]; // toast
      const pathComponente = path.join(
        this.viewsPath,
        "partials",
        `${nombreComponente}.html`,
      );

      try {
        const contenidoComponente = await fs.readFile(pathComponente, "utf8");
        // Reemplazamos la etiqueta por el contenido real del archivo
        resultado = resultado.replace(etiquetaCompleta, contenidoComponente);
      } catch (e) {
        console.warn(
          `[TemplateEngine] No se encontró el partial: ${nombreComponente}`,
        );
        resultado = resultado.replace(etiquetaCompleta, ""); // Limpiar etiqueta fallida
      }

      // Reiniciamos el índice del regex porque el string ha cambiado de tamaño
      regexComponente.lastIndex = 0;
    }
    return resultado;
  }

  procesarCondicionales(html, data) {
    const regexIf = /\{\{#if\s+([\w_]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
    const regexUnless = /\{\{#unless\s+([\w_]+)\}\}([\s\S]*?)\{\{\/unless\}\}/g;

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
            return itemHtml.replace(/\{\{([\w\._]+)\}\}/g, (m, key) => {
              return this.obtenerValor(item, key);
            });
          })
          .join("");
      },
    );

    // Procesar variables globales del objeto data
    resultado = resultado.replace(/\{\{([\w\._]+)\}\}/g, (match, key) => {
      if (key === "content") return match;
      return this.obtenerValor(data, key);
    });

    return resultado;
  }

  obtenerValor(obj, key) {
    if (key === "this") return String(obj);

    if (key.includes(".")) {
      return key.split(".").reduce((o, i) => (o ? o[i] : ""), obj) || "";
    }
    return obj[key] !== undefined ? String(obj[key]) : "";
  }
}

module.exports = TemplateEngine;
