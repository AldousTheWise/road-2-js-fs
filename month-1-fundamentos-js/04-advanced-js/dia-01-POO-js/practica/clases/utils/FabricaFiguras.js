/* ==================================
    FabricaFiguras.js
    Clase utilitaria que crea las 
    figuras geométricas
   ================================== */

import { Circulo } from "../figuras2d/Circulo.js";
import { Rectangulo } from "../figuras2d/Rectangulo.js";
import { Triangulo } from "../figuras2d/Triangulo.js";
import { Pentagono } from "../figuras2d/Pentagono.js";
import { Hexagono } from "../figuras2d/Hexagono.js";
import { Cubo } from "../figuras3d/Cubo.js";
import { Esfera } from "../figuras3d/Esfera.js";

export class FabricaFiguras {
  static crearDesdeJSON(jsonString) {
    const data = JSON.parse(jsonString);

    switch (data.tipo.toLowerCase()) {
      case "circulo":
        if (!data.radio) throw new Error("Radio requerido para círculo");
        return new Circulo(data.radio);

      case "rectangulo":
        if (!data.ancho || !data.alto)
          throw new Error("Ancho y Alto requeridos para rectángulo");
        return new Rectangulo(data.ancho, data.alto);

      case "triangulo":
        if (!data.base || !data.altura)
          throw new Error("Base y altura requeridos para triángulo");
        return new Triangulo(data.base, data.altura);

      case "pentagono":
        if (!data.lado) throw new Error("Lado requerido para pentágono");
        return new Pentagono(data.lado);

      case "hexagono":
        if (!data.lado) throw new Error("Lado requerido para hexágono");
        return new Hexagono(data.lado);

      case "esfera":
        if (!data.radio) throw new Error("Radio requerido para esfera");
        return new Esfera(data.radio);

      case "cubo":
        if (!data.radio) throw new Error("Lado requerido para cubo");
        return new Cubo(data.lado);

      default:
        throw new Error(`Tipo de figura no soportado: ${data.tipo}`);
    }
  }
}
