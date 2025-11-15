// Simulación de API para obtener ítems de un rpg

export async function obtenerItems() {
  return new Promise((resolve, reject) => {
    const delay = 250 + Math.random() * 600;

    setTimeout(() => {
      const fallo = Math.random() < 0.2;

      if (fallo) {
        reject(new Error("Error al obtener ítems desde el servidor"));
        return;
      }

      const items = [
        {
          id: 101,
          nombre: "Espada de Hierro",
          tipo: "arma",
          ataque: 8,
          rareza: "común",
        },
        {
          id: 102,
          nombre: "Armadura de cuero",
          tipo: "armadura",
          defensa: 5,
          rareza: "común",
        },
        {
          id: 103,
          nombre: "Poción de curación",
          tipo: "consumible",
          curación: 25,
          rareza: "común",
        },
        {
          id: 104,
          nombre: "Báculo de Roble",
          tipo: "arma",
          ataque: 6,
          bonoMagia: 3,
          rareza: "poco común",
        },
        {
          id: 105,
          nombre: "Anillo de Protección",
          tipo: "accesorio",
          defensa: 3,
          rareza: "raro",
        },
      ];

      resolve(items);
    }, delay);
  });
}
