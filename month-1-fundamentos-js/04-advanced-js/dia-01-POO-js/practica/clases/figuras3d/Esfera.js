import { FiguraTridimensional } from "../FiguraTridimensional.js";

export class Esfera extends FiguraTridimensional {
  constructor(radio) {
    super("Esfera");
    this.radio = radio;
  }

  calcularAreaSuperficial() {
    return 4 * Math.PI * this.radio * this.radio;
  }

  calcularVolumen() {
    return (4 / 3) * Math.PI * Math.pow(this.radio, 3);
  }

  calcularPerimetro() {
    return 2 * Math.PI * this.radio;
  }

  aceptar(dibujador) {
    return dibujador.visitarEsfera(this);
  }
}
