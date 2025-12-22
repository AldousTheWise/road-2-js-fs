/* ==================================
    main.js
    Punto de entrada principal
   ================================== */

import { Circulo } from "./clases/figuras2d/Circulo.js";
import { Rectangulo } from "./clases/figuras2d/Rectangulo.js";
import { Triangulo } from "./clases/figuras2d/Triangulo.js";
import { Pentagono } from "./clases/figuras2d/Pentagono.js";
import { Hexagono } from "./clases/figuras2d/Hexagono.js";

import { Cubo } from "./clases/figuras3d/Cubo.js";
import { Esfera } from "./clases/figuras3d/Esfera.js";

import { ColeccionFiguras } from "./clases/ColeccionFiguras.js";

import { FabricaFiguras } from "./clases/utils/FabricaFiguras.js";
import { DibujadorASCII } from "./clases/utils/DibujadorASCII.js";

console.log("1. CREACIÓN DIRECTA DE FIGURAS: \n");

const circulo = new Circulo(5);
console.log(`Círculo creado (radio: ${circulo.radio})`);
const rectangulo = new Rectangulo(10, 8);
console.log(`Rectangulo creado (${rectangulo.altura}x${rectangulo.ancho})`);
const cuadrado = new Rectangulo(6, 6);
console.log(`Cuadrado creado (${cuadrado.altura}x${cuadrado.ancho})`);
const triangulo = new Triangulo(8, 6);
console.log(
  `Triangulo creado (base: ${triangulo.base}, altura: ${triangulo.altura})\n`
);

console.log("\n2. COMPARACIÓN DE FIGURAS:\n");

console.log("Comparando áreas");
console.log(
  `* ${circulo.nombre} vs ${
    rectangulo.nombre
  }: ${ColeccionFiguras.compararAreas(circulo, rectangulo)}`
);
console.log(
  `* ${cuadrado.nombre} vs ${
    triangulo.nombre
  }: ${ColeccionFiguras.compararAreas(cuadrado, triangulo)}`
);
console.log(
  `* ${circulo.nombre} vs ${cuadrado.nombre}: ${ColeccionFiguras.compararAreas(
    circulo,
    cuadrado
  )}`
);

const otroCirculo = new Circulo(5);
console.log(
  `\n *${circulo.nombre} (radio: ${circulo.radio}) vs ${
    otroCirculo.nombre
  } (radio: ${otroCirculo}): ${ColeccionFiguras.compararAreas(
    circulo,
    otroCirculo
  )}`
);

console.log("\n3. MANEJO DE COLECCIÓN:\n");

const coleccion = new ColeccionFiguras();
coleccion.agregar(circulo);
coleccion.agregar(rectangulo);
coleccion.agregar(cuadrado);
coleccion.agregar(triangulo);
coleccion.agregar(otroCirculo);

console.log(`Figuras en colección: ${coleccion.figuras.length}\n`);
coleccion.listarFiguras();

console.log("\n4. COMPARANDO FIGURAS DE LA COLECCIÓN:\n");

// Comparar primera vs segunda figura
if (coleccion.figuras.length >= 2) {
  const figura1 = coleccion.figuras[0];
  const figura2 = coleccion.figuras[1];

  console.log(
    `* Primera figura vs Segunda figura: ${ColeccionFiguras.compararAreas(
      figura1,
      figura2
    )}`
  );
}

// Comparar todas las figuras con la primera (Círculo)
coleccion.figuras.slice(1).forEach((figura) => {
  const comparacion = ColeccionFiguras.compararAreas(circulo, figura);
  console.log(`* Círculo vs ${figura.nombre}: ${comparacion}`);
});

console.log("\n5. SERIALIZACION DE FABRICA:\n");

const jsonCirculo = JSON.stringify({
  tipo: "circulo",
  radio: 3,
});

const jsonRectangulo = JSON.stringify({
  tipo: "rectangulo",
  ancho: 4,
  alto: 7,
});

try {
  const circuloJSON = FabricaFiguras.crearDesdeJSON(jsonCirculo);
  const rectanguloJSON = FabricaFiguras.crearDesdeJSON(jsonRectangulo);

  console.log(`Círculo desde JSON: ${circuloJSON.describir().trim()}`);
  console.log(`Rectangulo desde JSON: ${rectanguloJSON.describir().trim()}\n`);

  console.log("Comparando figuras creadas de diferentes formas:");
  console.log(`* ${ColeccionFiguras.compararAreas(circuloJSON, circulo)}`);
  console.log(
    `* ${ColeccionFiguras.compararAreas(rectanguloJSON, rectangulo)}`
  );
} catch (e) {
  console.error(`Error: ${error.message}\n`);
}

console.log("\nDIBUJO ASCII DE FIGURAS\n");

const dibujador = new DibujadorASCII(25, 12);
console.log(circulo.aceptar(dibujador));
console.log(rectangulo.aceptar(dibujador));
console.log(cuadrado.aceptar(dibujador));
console.log(triangulo.aceptar(dibujador));

// Extension de sistema 1. Ejercicio de figuras extra
const pentagono = new Pentagono(5);
const hexagono = new Hexagono(4);

console.log("1. PENTAGONO:");
console.log(pentagono.aceptar(dibujador));
console.log(`Área: ${pentagono.calcularArea().toFixed(2)}`);
console.log(`Perímetro: ${pentagono.calcularPerimetro()}`);

console.log("2. HEXÁGONO:");
console.log(hexagono.aceptar(dibujador));
console.log(`Área: ${hexagono.calcularArea().toFixed(2)}`);
console.log(`Perímetro: ${hexagono.calcularPerimetro()}\n`);

console.log("3. DESDE JSON:");
try {
  const jsonPentagono = '{"tipo": "pentagono", "lado": 5}';
  const pentagonoJSON = FabricaFiguras.crearDesdeJSON(jsonPentagono);
  console.log(`Área: ${pentagonoJSON.calcularArea().toFixed(2)}\n`);
} catch (error) {
  console.error(`Error: ${error.message}\n`);
}

console.log("=== FIGURAS 3D ===\n");

// Crear figuras 3D
const esfera = new Esfera(3);
const cubo = new Cubo(4);

console.log("1. ESFERA:");
console.log(esfera.aceptar(dibujador));
console.log(
  `- Área superficial: ${esfera.calcularAreaSuperficial().toFixed(2)}`
);
console.log(`- Volumen: ${esfera.calcularVolumen().toFixed(2)}`);
console.log(`- Circunferencia: ${esfera.calcularPerimetro().toFixed(2)}\n`);

console.log("2. CUBO:");
console.log(cubo.aceptar(dibujador));
console.log(`- Área superficial: ${cubo.calcularAreaSuperficial().toFixed(2)}`);
console.log(`- Volumen: ${cubo.calcularVolumen().toFixed(2)}`);
console.log(`- Diagonal: ${cubo.calcularDiagonal().toFixed(2)}\n`);

// Probar con fábrica
console.log("3. DESDE JSON:");
try {
  const jsonEsfera = '{"tipo": "esfera", "radio": 3}';
  const esferaJSON = FabricaFiguras.crearDesdeJSON(jsonEsfera);
  console.log(`Esfera desde JSON: ${esferaJSON.describir()}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
}

// Colección con figuras 2D y 3D
console.log("\n4. COLECCIÓN MIXTA:");
coleccion.agregar(esfera);
coleccion.agregar(cubo);
console.log(`Total figuras: ${coleccion.figuras.length}`);
console.log(`Área/Volumen total: ${coleccion.calcularAreaTotal().toFixed(2)}`);

console.log("\n6. RESUMEN FINAL:\n");

console.log(`Área total: ${coleccion.calcularAreaTotal().toFixed(2)}`);
console.log(
  `Perímetro total: ${coleccion.calcularPerimetroTotal().toFixed(2)}`
);

let figuraMayor = coleccion.figuras[0];
for (let i = 1; i < coleccion.figuras.length; i++) {
  if (coleccion.figuras[i].calcularArea() > figuraMayor.calcularArea()) {
    figuraMayor = coleccion.figuras[i];
  }
}

console.log(
  `Figura con mayor área ${figuraMayor.nombre} (${figuraMayor
    .calcularArea()
    .toFixed(2)})`
);

console.log("\nSISTEMA EJECUTADO EXITOSAMENTE.\n");
