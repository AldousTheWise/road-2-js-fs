// 1. Tipos primitivos vs referencia
console.log("=== TIPOS PRIMITIVOS VS REFERENCIA ===");

let numero = 42;
let copiaNumero = numero;
copiaNumero = 100;
console.log(`Original: ${numero}`);
console.log(`Copia: ${copiaNumero}`);

let array = [1, 2, 3];
let referenceArray = array;
referenceArray.push(4);
console.log(`Array original: ${array}`);
console.log(`Referencia: ${referenceArray}`);

// 2. Scope y hoisting.
console.log("\n=== SCOPE Y HOISTING ===");

function demostrarScope() {
  if (true) {
    var variableVar = "visible solo en la función";
    let variableLet = "sólo en este bloque";
    const variableConst = "constante en este bloque";
  }

  console.log(variableVar); // Funciona.
  // console.log(variableLet); // ReferenceError
  // console.log(variableConst); // ReferenceError
}

demostrarScope();

// 3. Type coercion
console.log("\n=== TYPE COERCION ===");

console.log("5" + 2); // "52" (string concatenation)
console.log("5" - 2); // 3 (string to number)
console.log("5" * 2); // 10 (string to number)
console.log(true + 1); // 2 (boolean to number)
console.log(false + 1); // 1 (boolean to number)

// 4. Comparaciones:
console.log("\n=== COMPARACIONES ===");

console.log(5 == "5"); // true (coercion)
console.log(5 === "5"); // false (strict)

console.log(0 == false); // true (coercion)
console.log(0 === false); // false(strict)

console.log(null == undefined); // true
console.log(null === undefined); // false

// 5. Truthy/Falsy
console.log("\n=== TRUTHY/FALSY ===");

let valores = [0, 1, "", "Hola", null, undefined, [], {}];

valores.forEach((valor, index) => {
  if (valor) {
    console.log(`Valor ${index} (${valor}) es TRUTHY`);
  } else {
    console.log(`Valor ${index} (${valor}) es FALSY`);
  }
});

// 6. Buenas prácticas con variables
console.log("\n=== Buenas Prácticas ===");

// Preferir const cuando sea posible
const CONFIG = {
  apiUrl: "http://api.example.com",
  timeout: 5000,
};

// Usar let para variables que cambian
let contador = 0;
contador++;

// Evitar var en código moderno
// var globalVar = "evitar";

// Nombres descriptivos
let numerosDeUsuarios = 150;
// let n = 150; // no

console.log("variables configuradas correctamente");
