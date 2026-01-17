const API_KEY = "12345";

const btn = document.getElementById("btn-cargar");
const lista = document.getElementById("lista-tareas");

btn.addEventListener("click", async () => {
  lista.innerHTML = "<li>Cargando...</li>";

  try {
    const response = await fetch("api/tareas", {
      headers: {
        "x-api-key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener tareas");
    }

    const data = await response.json();

    lista.innerHTML = "";

    data.tareas.forEach((tarea) => {
      const li = document.createElement("li");
      li.textContent = `${tarea.titulo} (${tarea.prioridad})`;
      lista.appendChild(li);
    });
  } catch (error) {
    lista.innerHTML = `<li>Error: ${error.message}</li>`;
  }
});
