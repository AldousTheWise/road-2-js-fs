/* ==================================
    Pentagono.js
    Clase que define figura 
    tipo Pentagono
   ================================== */

import { FiguraGeometrica } from "../FiguraGeometrica.js";

export class Pentagono extends FiguraGeometrica {
  constructor(lado) {
    super("Pentagono");
    this.lado = lado;
  }

  calcularArea() {
    const n = 5;
    const l = this.lado;
    return (n * l * l) / (4 * Math.tan(Math.PI / n));
  }

  calcularPerimetro() {
    return 5 * this.lado;
  }

  aceptar(dibujador) {
    return dibujador.visitarPentagono(this);
  }
}
