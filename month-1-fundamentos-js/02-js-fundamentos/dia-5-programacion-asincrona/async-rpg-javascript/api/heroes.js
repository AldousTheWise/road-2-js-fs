// Simulación de API para obtener héroes en un RPG

export async function obtenerHeroes() {
  return new Promise((resolve, reject) => {
    const delay = 300 + Math.random() * 800;

    setTimeout(() => {
      const fallo = Math.random() < 0.2;

      if (fallo) {
        reject(new Error("Error al obtener héroes desde el servidor"));
      }

      const heroes = [
        {
          id: 1,
          nombre: "Magnosam el Beórnida",
          clase: "Guerrero",
          nivel: 5,
          hp: 120,
          mp: 20,
          inventario: [101, 102], // IDs de items
          misionesActivas: [202],
        },
        {
          id: 2,
          nombre: "Cloud el Celestial",
          clase: "Hechicero",
          nivel: 4,
          hp: 80,
          mp: 120,
          inventario: [104, 103], // IDs de items
          misionesActivas: [201, 202],
        },
        {
          id: 3,
          nombre: "Belz el Risueño",
          clase: "Bardo",
          nivel: 3,
          hp: 95,
          mp: 40,
          inventario: [102], // IDs de items
          misionesActivas: [],
        },
      ];

      resolve(heroes);
    }, delay);
  });
}
