/* ==================================
    Circulo.js
    Clase que define figura 
    tipo Círculo
   ================================== */

import { FiguraGeometrica } from "../FiguraGeometrica.js";

export class Circulo extends FiguraGeometrica {
  constructor(radio) {
    super("Circulo");
    this.radio = radio;
  }

  calcularArea() {
    return Math.PI * this.radio * this.radio;
  }
  calcularPerimetro() {
    return 2 * Math.PI * this.radio;
  }

  // Método específico
  calcularDiametro() {
    return this.radio * 2;
  }

  aceptar(dibujador) {
    return dibujador.visitarCirculo(this);
  }
}
