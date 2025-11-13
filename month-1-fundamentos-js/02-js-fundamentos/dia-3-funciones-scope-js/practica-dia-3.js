console.log("=== DEMOSTRACIÓN DE CIERRES Y CLOSURES ===\n");

// 1. Simulador de carro de compras con closures

function crearCarrito() {
  // Variables privadas dentro del scope
  let items = [];
  let total = 0;

  // Retorna un objeto con métodos que puedan acceder a estas variables
  return {
    // Agrega un producto al carro
    agregarItem: function (nombre, precio) {
      items.push({ nombre, precio });
      total += precio;
      console.log(`Agregado: ${nombre} ($${precio})`);
    },

    // Elimina un producto por nombre
    removerItem: function (nombre) {
      const index = items.findIndex((item) => item.nombre === nombre);
      if (index !== -1) {
        const precio = items[index].precio;
        items.splice(index, 1);
        console.log(`Removido: ${nombre} (-$${precio})`);
      }
    },

    // Devuelve el total actual usando una arrow function
    obtenerTotal: () => total,

    // Devuelve una copia del array para evitar modificarlo desde afuera
    obtenerItems: () => [...items],

    // Aplica un descuento al total
    aplicarDescuento: function (porcentaje) {
      const descuento = total * (porcentaje / 100);
      total -= descuento;
      console.log(
        `Descuento aplicado: -$${descuento.toFixed(2)} (${porcentaje}%)`
      );
    },
  };
}

// Uso del carrito
const carrito = crearCarrito();
carrito.agregarItem("Laptop", 1000);
carrito.agregarItem("Mouse", 50);
carrito.agregarItem("Teclado", 80);
console.log(`Total actual: $${carrito.obtenerTotal()}`);
carrito.aplicarDescuento(10);
console.log(`Total final: $${carrito.obtenerTotal()}\n`);

/* 
El carrito usa closures para “encapsular” las variables `items` y `total`.
Solo los métodos internos pueden acceder o modificarlas.
Es como tener una caja cerrada donde solo ciertas llaves (funciones) pueden entrar.
*/

// 2. Funcion factory con closures:

function crearValidador(tipo) {
  // Diccionario con diferentes funciones de validación.
  const validadores = {
    email: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor),
    telefono: (valor) => /^\d{10}$/.test(valor),
    url: (valor) => /^https?:\/\/.+\..+/.test(valor),
  };

  // Retorna una función que recuerda el tipo que se le pasó
  return function (valor) {
    const esValido = validadores[tipo](valor);
    console.log(`${tipo}: "${valor}" - ${esValido ? "Válido" : "Inválido"}`);
  };
}

// Creamos tres validadores distintos usando el mismo factory
const validarEmail = crearValidador("email");
const validarTeléfono = crearValidador("telefono");
const validarUrl = crearValidador("url");

validarEmail("usuario@ejemplo.com");
validarEmail("invalido-email");
validarTeléfono("1234567890");
validarTeléfono("123-456");
validarUrl("https://www.google.com");
validarUrl("no-es-url");

/* 
Cada validador “recuerda” el tipo que recibió (`email`, `telefono`, `url`) gracias al `closure`.
Aunque la función `crearValidador()` ya terminó, su entorno (con tipo) sigue disponible para la función interna.
*/

// 3. Función con parámetros avanzados:

function crearUsuario(nombre, apellido, ...hobbies) {
  const usuario = {
    nombre: nombre || "Anónimo", // Valor por defecto
    apellido: apellido || "Desconocido", // Valor por defecto
    nombreCompleto: `${nombre || "Anónimo"} ${apellido || "Desconocido"}`,
    hobbies: hobbies.length > 0 ? hobbies : "No especificado",
    fechaCreacion: new Date().toLocaleDateString(),
  };

  return usuario;
}

// Creamos distintos usuarios
const usuario1 = crearUsuario("Ana", "García", "leer", "correr", "programar");
const usuario2 = crearUsuario("Carlos"); // Valores por defecto.
const usuario3 = crearUsuario(); // todo por defecto.

console.log("Usuario 1:", usuario1);
console.log("Usuario 2:", usuario2);
console.log("Usuario 3:", usuario3);

/* 
- Se usan parámetros por defecto con `||`.
- `...hobbies` es un **Rest Parameter** que convierte los hobbies en un array.
- Si no hay hobbies, se coloca “No especificado”.
*/

//4. Spread Operator:

const configBase = {
  apiUrl: "http://api.example.com",
  timeout: 5000,
  retries: 3,
};

// Creamos dos configuraciones copiando y modificando la base
const configProduccion = {
  ...configBase, // copia todas las propiedades
  enviroment: "production",
  debug: false,
  apiUrl: "http://api.production.com", //sobrescribe al anterior
};

const configDesarrollo = {
  ...configBase,
  enviroment: "development",
  debug: true,
  extraLogging: true,
};

console.log("\nConfig Producción", configProduccion);
console.log("Config Desarrollo", configDesarrollo);

/*
El spread operator (`...`) copia todas las propiedades de un objeto a otro.
Luego puedes sobrescribir o agregar nuevas propiedades sin afectar al original.
*/

// 5. Funciones flecha vs funciones tradicionales.
const ejemplos = {
  tradicional: function () {
    return `this en función tradicional: ${this?.tipo || "global"}`;
  },

  flecha: () => {
    return `this en función flecha: ${this?.tipo || "global"}`;
  },

  tipo: "objeto",
};

console.log("\n=== THIS EN FUNCIONES ===");
console.log(ejemplos.tradicional()); // Se refiere al objeto
console.log(ejemplos.flecha()); // Se refiere al scope global

/*
// - En la función tradicional, `this` depende de quién llama la función (aquí: el objeto ejemplos).
- En la arrow function, `this` hereda el del entorno donde fue creada (el global, en este caso). 
 */
