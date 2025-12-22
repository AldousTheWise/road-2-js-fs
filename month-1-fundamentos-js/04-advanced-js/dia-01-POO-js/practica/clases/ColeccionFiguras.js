/* ==================================
    ColeccionFiguras.js
    Clase que define el array que
    contiene las figuras
   ================================== */

export class ColeccionFiguras {
  constructor() {
    this.figuras = [];
  }

  agregar(figura) {
    if (
      figura &&
      typeof figura.calcularArea === "function" &&
      typeof figura.calcularPerimetro === "function"
    ) {
      this.figuras.push(figura);
      return true;
    }
    return false;
  }

  listarFiguras() {
    console.log("=== COLECCIÓN DE FIGURAS ===");
    this.figuras.forEach((figura, index) => {
      console.log(`${index + 1}.${figura.describir()}`);
    });
  }

  calcularAreaTotal() {
    return this.figuras.reduce(
      (total, figura) => total + figura.calcularArea(),
      0
    );
  }

  calcularPerimetroTotal() {
    return this.figuras.reduce(
      (total, figura) => total + figura.calcularPerimetro(),
      0
    );
  }

  filtrarPorTipo(nombreTipo) {
    return this.figuras.filter((figura) => figura.nombre === nombreTipo);
  }

  static compararAreas(figura1, figura2) {
    const area1 = figura1.calcularArea();
    const area2 = figura2.calcularArea();

    if (area1 > area2) {
      return `${figura1.nombre} es más grande que ${figura2.nombre}`;
    } else if (area1 < area2) {
      return `${figura2.nombre} es más grande que ${figura1.nombre}`;
    } else {
      return `Ambas figuras tienen la misma área.`;
    }
  }
}
