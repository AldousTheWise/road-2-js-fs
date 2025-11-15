// Simulación de API de criaturas de un RPG
// Devuelve una promesa con datos de monstruos o falla aleatoriamente

export async function obtenerMonstruos() {
  return new Promise((resolve, reject) => {
    const delay = 300 + Math.random() * 700; // Latencia variable

    setTimeout(() => {
      const fallo = Math.random() < 0.2; //Probabilidad de falla

      if (fallo) {
        reject(new Error("Error al obtener monstruos desde el servidor"));
        return;
      }

      const monstruos = [
        { id: 1, nombre: "Goblin", nivel: 2, tipo: "bestia", hp: 35 },
        { id: 2, nombre: "Lobo Sombrío", nivel: 3, tipo: "bestia", hp: 50 },
        { id: 3, nombre: "Esqueleto", nivel: 4, tipo: "no-muerto", hp: 40 },
        { id: 4, nombre: "Trol de Cueva", nivel: 6, tipo: "gigante", hp: 120 },
      ];

      resolve(monstruos);
    }, delay);
  });
}
