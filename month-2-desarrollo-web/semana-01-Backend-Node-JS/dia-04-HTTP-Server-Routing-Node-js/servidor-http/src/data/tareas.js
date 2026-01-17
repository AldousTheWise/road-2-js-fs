let tareas = [
  {
    id: 1,
    titulo: "Aprender Node.js",
    descripcion: "Completar tutoriales básicos",
    completada: false,
    prioridad: "alta",
  },
  {
    id: 2,
    titulo: "Practicar HTTP",
    descripcion: "Crear servidor básico",
    completada: true,
    prioridad: "media",
  },
];

let siguienteId = 3;

module.exports = {
  tareas,
  getNextId: () => siguienteId++,
};
