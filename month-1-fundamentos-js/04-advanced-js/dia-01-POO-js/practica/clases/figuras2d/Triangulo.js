/* ==================================
    Triangulo.js
    Clase que define figura 
    tipo Triangulo
   ================================== */

import { FiguraGeometrica } from "../FiguraGeometrica.js";

export class Triangulo extends FiguraGeometrica {
  constructor(base, altura) {
    super("Triangulo");
    this.base = base;
    this.altura = altura;
  }

  calcularArea() {
    return (this.base * this.altura) / 2;
  }

  calcularPerimetro() {
    return 3 * this.base;
  }

  // Método específico
  calcularHipotenusa() {
    return Math.sqrt(this.base * this.base + this.altura * this.altura);
  }

  aceptar(dibujador) {
    return dibujador.visitarTriangulo(this);
  }
}
