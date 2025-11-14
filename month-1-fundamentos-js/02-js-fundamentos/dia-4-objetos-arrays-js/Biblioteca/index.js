import biblioteca from "./services/bibliotecaService.js";
import usuarioService from "./services/usuarioService.js";

console.clear();
console.log("=== SISTEMA DE GESTIÓN DE BIBLIOTECA ===\n");

// Crear usuarios
const usuario1 = usuarioService.crearUsuario("Ian Riffo");
const usuario2 = usuarioService.crearUsuario("Damian Monrroy");

console.log("Usuarios registrados:");
console.log(usuarioService.listarUsuarios());

console.log("\nLibros disponibles:");
console.log(biblioteca.obtenerDisponibles());

console.log("\nPréstamos:");
console.log(usuarioService.prestarLibro(usuario1.id, 1));
console.log(usuarioService.prestarLibro(usuario2.id, 3));

console.log("\nEstadísticas:");
console.log(biblioteca.obtenerEstadisticas());

console.log("\nPopularidad:");
console.log(usuarioService.librosMasPrestados());
