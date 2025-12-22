/* ==================================
    Rectangulo.js
    Clase que define figura 
    tipo Rectangulo
   ================================== */

import { FiguraGeometrica } from "../FiguraGeometrica.js";

export class Rectangulo extends FiguraGeometrica {
  constructor(ancho, alto) {
    super("Rectangulo");
    this.ancho = ancho;
    this.altura = alto;
  }

  calcularArea() {
    return this.ancho * this.altura;
  }

  calcularPerimetro() {
    return 2 * (this.ancho + this.altura);
  }

  // Método específico
  esCuadrado() {
    return this.ancho === this.altura;
  }

  aceptar(dibujador) {
    return dibujador.visitarRectangulo(this);
  }
}
