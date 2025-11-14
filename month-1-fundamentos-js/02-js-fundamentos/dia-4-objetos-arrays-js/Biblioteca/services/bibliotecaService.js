import Libro from "../models/Libro.js";
import libros from "../data/libros.js";

// Convertir los objetos planos en instancias de la clase Libro:
const listaLibros = libros.map((data) => new Libro(data));

const biblioteca = {
  // Crear libro y agregarlo a la lista:
  agregarLibro(libroData) {
    const nuevoLibro = new Libro({
      id: listaLibros.length + 1,
      ...libroData,
    });

    listaLibros.push(nuevoLibro);
    return nuevoLibro.info;
  },

  // Libros disponibles:
  obtenerDisponibles() {
    return listaLibros
      .filter((libro) => libro.disponible)
      .map((libro) => libro.info);
  },

  // Buscar por texto (autor o título)
  buscar(criterio) {
    const termino = criterio.toLowerCase();

    return listaLibros
      .filter(
        (libro) =>
          libro.titulo.toLowerCase().includes(termino) ||
          libro.autor.toLowerCase().includes(termino)
      )
      .map((libro) => libro.info);
  },

  // Búsqueda avanzada con múltiples criterios:
  buscarAvanzado(filtros = {}) {
    return listaLibros
      .filter((libro) =>
        Object.entries(filtros).every(([campo, valor]) => {
          if (!libro[campo]) return false;
          return libro[campo]
            .toString()
            .toLowerCase()
            .includes(valor.toLowerCase());
        })
      )
      .map((libro) => libro.info); //
  },

  // Prestar libro:
  prestar(id) {
    const libro = listaLibros.find((l) => l.id === id);

    if (!libro) return { exito: false, mensaje: "Libro no encontrado." };
    if (!libro.disponible)
      return { exito: false, mensaje: "El libro ya fue prestado." };

    libro.disponible = false;
    return {
      exito: true,
      mensaje: `Libro "${libro.titulo}" prestado exitosamente.`,
      libro: libro.info,
    };
  },

  // Devolver libro:
  devolver(id) {
    const libro = listaLibros.find((l) => l.id === id);

    if (!libro) return { exito: false, mensaje: "Libro no encontrado." };
    if (libro.disponible)
      return { exito: false, mensaje: "El libro ya está disponible." };

    libro.disponible = true;
    return {
      exito: true,
      mensaje: `Libro "${libro.titulo}" devuelto exitosamente.`,
      libro: libro.info,
    };
  },

  // Estadísticas básicas:
  obtenerEstadisticas() {
    const total = listaLibros.length;
    const disponibles = listaLibros.filter((l) => l.disponible).length;
    const prestados = total - disponibles;

    const porGenero = listaLibros.reduce((acc, libro) => {
      acc[libro.genero] = (acc[libro.genero] || 0) + 1;
      return acc;
    }, {});

    return { total, disponibles, prestados, porGenero };
  },

  // Getter de todos los libros (read-only):
  get todos() {
    return listaLibros.map((libro) => libro.info);
  },
};

export default biblioteca;
