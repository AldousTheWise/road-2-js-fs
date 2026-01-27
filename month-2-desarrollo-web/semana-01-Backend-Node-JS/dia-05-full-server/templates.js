const fs = require("fs").promises;
const path = require("path");

class TemplateEngine {
  constructor(viewsPath = "./views") {
    this.viewsPath = viewsPath;
  }

  /**
   * Método principal de renderizado corregido
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

      // 4. Cargar componentes dinámicos (Partials)
      html = await this.cargarComponentes(html);

      // 5. ORDEN CRÍTICO:
      // Primero procesamos los Each (que ahora procesan sus propios condicionales internos)
      html = this.procesarVariablesYEach(html, data);

      // Finalmente procesamos los condicionales globales (session, etc)
      html = this.procesarCondicionales(html, data);

      return html;
    } catch (error) {
      console.error("Error en TemplateEngine:", error);
      throw error;
    }
  }

  async cargarComponentes(html) {
    const regexComponente = /\{\{componente:(\w+)\}\}/g;
    let resultado = html;
    let match;

    while ((match = regexComponente.exec(resultado)) !== null) {
      const etiquetaCompleta = match[0];
      const nombreComponente = match[1];
      const pathComponente = path.join(
        this.viewsPath,
        "partials",
        `${nombreComponente}.html`,
      );

      try {
        const contenidoComponente = await fs.readFile(pathComponente, "utf8");
        resultado = resultado.replace(etiquetaCompleta, contenidoComponente);
      } catch (e) {
        console.warn(
          `[TemplateEngine] No se encontró el partial: ${nombreComponente}`,
        );
        resultado = resultado.replace(etiquetaCompleta, "");
      }
      regexComponente.lastIndex = 0;
    }
    return resultado;
  }

  procesarCondicionales(html, data) {
    const regexIf = /\{\{#if\s+([\w\._]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
    const regexUnless =
      /\{\{#unless\s+([\w\._]+)\}\}([\s\S]*?)\{\{\/unless\}\}/g;

    let resultado = html;

    // Procesar IFs
    resultado = resultado.replace(regexIf, (match, variable, contenido) => {
      const valor = this.obtenerValor(data, variable);
      // Evaluación flexible: acepta booleano true, string "true", o existencia de objeto
      const esVerdadero = valor && valor !== "false" && valor !== "";

      return esVerdadero ? this.procesarCondicionales(contenido, data) : "";
    });

    // Procesar UNLESS
    resultado = resultado.replace(regexUnless, (match, variable, contenido) => {
      const valor = this.obtenerValor(data, variable);
      const esFalso = !valor || valor === "false" || valor === "";

      return esFalso ? this.procesarCondicionales(contenido, data) : "";
    });

    return resultado;
  }

  procesarVariablesYEach(html, data) {
    // 1. Procesar {{#each}} con inyección de condicionales interna
    let resultado = html.replace(
      /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
      (match, arrayName, contenido) => {
        const array = data[arrayName];
        if (!Array.isArray(array)) return "";

        return array
          .map((item) => {
            let itemHtml = contenido;

            // Procesamos condicionales específicos de este item (ej: puedeBorrar)
            itemHtml = this.procesarCondicionales(itemHtml, item);

            // Reemplazamos variables del item
            return itemHtml.replace(/\{\{([\w\._]+)\}\}/g, (m, key) => {
              return this.obtenerValor(item, key);
            });
          })
          .join("");
      },
    );

    // 2. Procesar variables globales que hayan quedado
    resultado = resultado.replace(/\{\{([\w\._]+)\}\}/g, (match, key) => {
      if (key === "content") return match;
      return this.obtenerValor(data, key);
    });

    return resultado;
  }

  obtenerValor(obj, key) {
    if (!obj) return "";
    if (key === "this") return String(obj);

    if (key.includes(".")) {
      const valor = key
        .split(".")
        .reduce((o, i) => (o ? o[i] : undefined), obj);
      return valor !== undefined ? valor : "";
    }

    return obj[key] !== undefined ? obj[key] : "";
  }
}

module.exports = TemplateEngine;
