class Libro {
  // Atributos privados
  #id;
  #titulo;
  #autor;
  #genero;
  #disponible;

  constructor({ id, titulo, autor, genero, disponible = true }) {
    this.#id = id; // Setter
    this.#titulo = titulo; // Setter
    this.#autor = autor; // Setter
    this.#genero = genero; // Setter
    this.#disponible = disponible; // Setter
  }

  // Getters (Solo lectura)
  get id() {
    return this.#id;
  }
  get titulo() {
    return this.#titulo;
  }
  get autor() {
    return this.#autor;
  }
  get genero() {
    return this.#genero;
  }
  get disponible() {
    return this.#disponible;
  }

  // Setters (con validación)
  set titulo(valor) {
    if (!valor || typeof valor !== "string") {
      throw new Error("El título debe ser un texto válido");
    }
    this.#titulo = valor.trim();
  }

  set autor(valor) {
    if (!valor || typeof valor !== "string") {
      throw new Error("El autor debe ser un texto válido");
    }

    this.#autor = valor.trim();
  }

  set genero(valor) {
    if (!valor || typeof valor !== "string") {
      throw new Error("El género debe ser un texto válido");
    }

    this.#genero = valor.trim();
  }

  set disponible(valor) {
    if (typeof valor !== "boolean") {
      throw new Error("El estado 'disponible' debe ser booleano");
    }

    this.#disponible = valor;
  }

  // Getter derivado
  get descripcion() {
    return `${this.#titulo} - ${this.#autor} (${this.genero})`;
  }

  // Método para poder visualizar los atributos de la clase:
  get info() {
    return {
      id: this.id,
      titulo: this.titulo,
      autor: this.autor,
      genero: this.genero,
      disponible: this.disponible,
    };
  }

  toJSON() {
    return this.info;
  }
}

export default Libro;
