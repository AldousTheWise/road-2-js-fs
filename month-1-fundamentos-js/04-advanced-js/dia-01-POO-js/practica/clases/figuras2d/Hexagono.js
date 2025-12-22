/* ==================================
    Hexagono.js
    Clase que define figura 
    tipo Hexagono
   ================================== */

import { FiguraGeometrica } from "../FiguraGeometrica.js";

export class Hexagono extends FiguraGeometrica {
  constructor(lado) {
    super("Hexagono");
    this.lado = lado;
  }

  calcularArea() {
    const l = this.lado;
    return (3 * Math.sqrt(3) * l * l) / 2;
  }

  calcularPerimetro() {
    return 6 * this.lado;
  }

  aceptar(dibujador) {
    return dibujador.visitarHexagono(this);
  }
}
