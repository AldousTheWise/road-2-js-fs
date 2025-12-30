const operador = process.argv[2];
const a = Number(process.argv[3]);
const b = Number(process.argv[4]);

const operaciones = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => {
    if (b === 0) {
      console.error("Error: división por cero");
      process.exit(1);
    }
    return a / b;
  },
};

if (!operaciones[operador]) {
  console.error("Operador no válido. Usa + - * /");
  process.exit(1);
}

console.log(operaciones[operador](a, b));

/**
 * OUTPUT:
 * 
PS C:\DEVZONE\road-2-js-fs\month-2-desarrollo-web\semana-01-Backend-Node-JS\dia-01-Introduccion-Node-js> node calculadora.js + 5 3   
8
PS C:\DEVZONE\road-2-js-fs\month-2-desarrollo-web\semana-01-Backend-Node-JS\dia-01-Introduccion-Node-js> node calculadora.js - 10 4  
6
PS C:\DEVZONE\road-2-js-fs\month-2-desarrollo-web\semana-01-Backend-Node-JS\dia-01-Introduccion-Node-js> node calculadora.js * 6 7   
42
PS C:\DEVZONE\road-2-js-fs\month-2-desarrollo-web\semana-01-Backend-Node-JS\dia-01-In42
42
PS C:\DEVZONE\road-2-js-fs\month-2-desarrollo-web\semana-01-Backend-Node-JS\dia-01-Introduccion-Node-js> node calculadora.js / 20 5
4
PS C:\DEVZONE\road-2-js-fs\month-2-desarrollo-web\semana-01-Backend-Node-JS\dia-01-Introduccion-Node-js> node calculadora.js / 20 0
Error: división por cero
PS C:\DEVZONE\road-2-js-fs\month-2-desarrollo-web\semana-01-Backend-Node-JS\dia-01-Introduccion-Node-js> node calculadora.js $ 30 2
Operador no válido. Usa + - * /
 */
