/* ================================== 
    FiguraGeometrica.js
    Clase base abstracta
   ================================== */

export class FiguraGeometrica {
  // Propiedad privada
  #id;

  constructor(nombre) {
    this.nombre = nombre;
    this.#id = Math.random().toString(36).substring(2, 9);
  }

  // Método abstracto
  calcularArea() {
    throw new Error(
      "Método calcularArea() debe ser implementado por la subclase"
    );
  }

  calcularPerimetro() {
    throw new Error(
      "Método calcularPerimetro() debe ser implementado por la subclase"
    );
  }

  // Método común
  describir() {
    return `
            ${this.nombre} - Área: ${this.calcularArea().toFixed(
      2
    )}, Perímetro: ${this.calcularPerimetro().toFixed(2)}
        `;
  }

  // Getter para ID
  get id() {
    return this.#id;
  }

  aceptar(dibujador) {
    throw new Error("Método aceptar() debe ser implementado");
  }
}
