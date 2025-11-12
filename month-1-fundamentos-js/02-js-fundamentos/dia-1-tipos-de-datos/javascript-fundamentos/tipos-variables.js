console.log("=== DEMOSTRACIÓN DE VAR, LET Y CONST ===\n");

/*------------------------------------------------------

    1. ALCANCE (SCOPE).

-------------------------------------------------------*/

console.log("=== 1. SCOPE (GLOBAL/ FUNCIÓN/ BLOQUE) ===");

// Variable global.
var globalVar = "Soy var global";
let globalLet = "Soy let global";
const globalConst = "Soy const global";

console.log(globalVar);
console.log(globalLet);
console.log(globalConst);

// Ejemplo dentro de una función.
function demoFuncion() {
  var funcionVar = "var dentro de una función";
  let funcionLet = "let dentro de una función";
  const funcionConst = "const dentro de una función";

  console.log(funcionVar);
  console.log(funcionLet);
  console.log(funcionConst);
}

// Estas fallan porque no existen fuera de la función:
// console.log(funcionVar);
// console.log(funcionLet);
// console.log(funcionConst);

/* ---------------------------------------------------------
  
    2. Hoisting

---------------------------------------------------------- */

console.log("\n=== 2. HOISTING ===");

console.log(aVar); // undefined (var is hoisted)
var aVar = 10;

// console.log(aLet); // Reference Error (TDZ)
// console.log(aConst); // Reference Error (TDZ)

let aLet = 20;
const aConst = 30;

console.log(aVar, aLet, aConst);

/* ---------------------------------------------------------
  
    3. TEMPORAL DEAD ZONE (TDZ)

---------------------------------------------------------- */

console.log("\n=== 2. TEMPORAL DEAD ZONE (TDZ) ===");

function demoTDZ() {
  // Acceso a let o const ANTES de declararse -> Error

  //console.log(msgLet); // TDZ
  //console.log(msgConst); // TDZ

  let msgLet = "Ahora let está inicializado";
  const msgConst = "Ahora const está inicializado";

  console.log(msgLet);
  console.log(msgConst);
}

demoTDZ();

/* ---------------------------------------------------------
  
    4. REDECLARACIÓN Y REASIGNACIÓN.

---------------------------------------------------------- */

console.log("\n=== 4. REDECLARACIÓN Y REASIGNACIÓN ===");

// var se puede redeclarar y reasignar
var x = 1; // variable inicial
var x = 2; // redeclaración permitida
x = 3; // reasignación

// let NO se puede redeclarar, pero si reasignar
let y = 10;
//let y = 20; // SyntaxError (redeclaración)
y = 30; // reasignación permitida

// const NO permite redeclarar ni reasignar
const z = 100;
// z = 200; // TypeError

console.log(`x (var): ${x}`);
console.log(`y (let): ${y}`);
console.log(`z (const): ${z}`);

/* ---------------------------------------------------------
  
    5. CONST EN OBJETOS Y ARRAYS.

---------------------------------------------------------- */

console.log("\n=== 5. CONST EN OBJETOS Y ARRAYS ===");

const persona = { nombre: "Aldo" };
persona.nombre = "Lucas"; // permitido (mutación)
console.log(persona);

// persona = {}; // NO permitido (reasignación)

const numeros = [1, 2, 3];
numeros.push(4); // permitido
console.log(numeros);

/* ---------------------------------------------------------
  
    FIN

---------------------------------------------------------- */

console.log("\n Demo completa realizada.");
