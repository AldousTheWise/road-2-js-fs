import { FiguraTridimensional } from "../FiguraTridimensional.js";

export class Cubo extends FiguraTridimensional {
  constructor(lado) {
    super("Cubo");
    this.lado = lado;
  }

  calcularAreaSuperficial() {
    return 6 * this.lado * this.lado;
  }

  calcularVolumen() {
    return Math.pow(this.lado, 3);
  }

  calcularPerimetro() {
    return 12 * this.lado;
  }

  calcularDiagonal() {
    return this.lado * Math.sqrt(3);
  }

  aceptar(dibujador) {
    return dibujador.visitarCubo(this);
  }
}
