import { FiguraGeometrica } from "./FiguraGeometrica.js";

export class FiguraTridimensional extends FiguraGeometrica {
  constructor(nombre) {
    super(nombre);
  }

  calcularArea() {
    return this.calcularAreaSuperficial();
  }

  calcularAreaSuperficial() {
    throw new Error("Método calcularAreaSuperficial() debe ser implementado");
  }

  calcularVolumen() {
    throw new Error("Método calcularVolumen() debe ser implementado");
  }

  describir() {
    return `${
      this.nombre
    } - Área Superficial: ${this.calcularAreaSuperficial().toFixed(
      2
    )}, Volumen: ${this.calcularVolumen().toFixed(2)}`;
  }
}
