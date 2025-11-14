import Usuario from "../models/Usuario.js";
import biblioteca from "./bibliotecaService.js";

// BBDD interna:
let usuarios = [];

const usuarioService = {
  // Crear usuario:
  crearUsuario(nombre) {
    const nuevoUsuario = new Usuario({
      id: usuarios.length + 1,
      nombre,
    });

    usuarios.push(nuevoUsuario);
    return nuevoUsuario.info;
  },

  // Buscar usuario por ID:
  obtenerUsuario(id) {
    const usuario = usuarios.find((u) => u.id === id) || null;
    return usuario ? usuario : null;
  },

  // Listar todos:
  listarUsuarios() {
    return usuarios.map((usuario) => usuario.info);
  },

  // Préstamo de libro
  prestarLibro(usuarioId, libroId) {
    const usuario = this.obtenerUsuario(usuarioId);
    if (!usuario) {
      return { exito: false, mensaje: "Usuario no encontrado." };
    }

    const resultado = biblioteca.prestar(libroId);

    if (!resultado.exito) {
      return resultado;
    }

    // Registrar evento en historial de usuario
    usuario._registrarEnHistorial({
      tipo: "prestamo",
      libroId,
      fechaPrestamo: new Date(),
      fechaDevolucion: null,
    });

    return {
      exito: true,
      mensaje: `${usuario.nombre} ha tomado prestado "${
        resultado.mensaje.split(`"`)[1]
      }".`,
      usuario: usuario.info,
      libro: resultado.libro,
    };
  },

  // Devolución del libro
  devolverLibro(usuarioId, libroId) {
    const usuario = this.obtenerUsuario(usuarioId);
    if (!usuario) {
      return { exito: false, mensaje: "Usuario no encontrado." };
    }

    const resultado = biblioteca.devolver(libroId);
    if (!resultado.exito) return resultado;

    // Buscar en historial el préstamo activo:
    const evento = usuario.historial.find(
      (h) => h.libroId === libroId && h.fechaDevolucion === null
    );

    if (!evento) {
      return {
        exito: false,
        mensaje: "El usuario no tiene este libro prestado.",
      };
    }

    evento.fechaDevolucion = new Date();

    return {
      exito: true,
      mensaje: `${usuario.nombre} devolvió el libro correctamente.`,
      usuario: usuario.info,
      libro: resultado.libro,
    };
  },

  // Multas
  calcularMulta(usuarioId) {
    const usuario = this.obtenerUsuario(usuarioId);
    if (!usuario) return null;

    const MILIS_DIA = 1000 * 60 * 60 * 24;

    const prestamosActivos = usuario.historial.filter(
      (h) => h.fechaDevolucion === null
    );

    const multas = prestamosActivos.map((p) => {
      const dias = Math.floor(
        (Date.now() - p.fechaPrestamo.getTime()) / MILIS_DIA
      );
      const multa = dias > 7 ? (dias - 7) * 100 : 0;

      return {
        libroId: p.libroId,
        dias,
        multa,
      };
    });

    return multas;
  },

  // Popularidad
  librosMasPrestados() {
    const registros = usuarios.flatMap((u) => u.historial);

    const conteo = registros.reduce((acc, { libroId }) => {
      acc[libroId] = (acc[libroId] || 0) + 1;
      return acc;
    }, {});

    const ordenados = Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .map(([libroId, cantidad]) => {
        const libro = biblioteca.todos.find((l) => l.id == libroId);
        return {
          libroId,
          titulo: libro.titulo,
          vecesPrestado: cantidad,
        };
      });
    return ordenados;
  },
};

export default usuarioService;
