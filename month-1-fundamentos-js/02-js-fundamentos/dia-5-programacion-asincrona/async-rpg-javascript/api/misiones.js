// Simulación de API para obtener misiones en un RPG

export async function obtenerMisiones() {
  return new Promise((resolve, reject) => {
    const delay = 400 + Math.random() * 500;

    setTimeout(() => {
      const fallo = Math.random() < 0.25;

      if (fallo) {
        reject(new Error("Error al obtener misiones del servidor"));
        return;
      }

      const misiones = [
        {
          id: 201,
          titulo: "Cazar al Lobo Sombrío",
          descripción:
            "Derrota al feroz Lobo Sombrío que acecha en el Bosque Negro.",
          recompensa: { xp: 150, oro: 25 },
          nivelRecomendado: 3,
        },
        {
          id: 202,
          titulo: "Recolectar Hierbas Curativas",
          descripción:
            "Encuentra 5 hierbas curativas para el boticario del pueblo.",
          recompensa: { xp: 150, item: "Poción de Curación" },
          nivelRecomendado: 1,
        },
        {
          id: 203,
          titulo: "Derrotar al Trol de la Cueva",
          descripción:
            "Explora la Cueva del Eco y elimina al trol que vive en su interior",
          recompensa: { xp: 250, oro: 40, item: "Anillo de Protección" },
          nivelRecomendado: 5,
        },
      ];

      resolve(misiones);
    }, delay);
  });
}
