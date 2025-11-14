class Usuario {
  #id;
  #nombre;
  #historial; // Historial de prestamos.

  constructor({ id, nombre }) {
    this.#id = id;
    this.#nombre = nombre; // Setter
    this.#historial = []; // Lista interna
  }

  // Getters
  get id() {
    return this.#id;
  }
  get nombre() {
    return this.#nombre;
  }
  get historial() {
    return [...this.#historial];
  }

  // Setters
  set nombre(valor) {
    if (!valor || typeof valor !== "string") {
      throw new Error("El error debe ser un texto válido.");
    }
    this.#nombre = valor.trim();
  }

  // Método interno, llamado por el servicio
  _registrarEnHistorial(evento) {
    this.#historial.push(evento);
  }

  // Transforma la clase en formato JSON
  // de forma que puedan ser leídos los atributos que están en privado.
  get info() {
    return {
      id: this.id,
      nombre: this.nombre,
      historial: this.historial,
    };
  }

  toJSON() {
    return this.info;
  }
}

export default Usuario;
