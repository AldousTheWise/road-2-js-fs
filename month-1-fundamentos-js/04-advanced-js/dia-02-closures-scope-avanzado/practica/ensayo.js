function crearCaja() {
  let valor = 0;

  return function () {
    valor++;
    console.log(valor);
  };
}

const caja = crearCaja();

caja();
caja();
caja();

function crearEventBus() {
  // Objeto privado donde se guardan los listeners
  // La clave (key) es el nombre del evento (string)
  // El valor (value) es un array de funciones que escuchan este evento.
  const listeners = {};

  // La funcion devuelve un objeto: esta será la "instancia" del EventBus
  return {
    /**
     * on = suscribirse a un evento
     * @param {string} evento - nombre del evento (ej: cache:hit)
     * @param {function} callback - función que se ejecutará cuando ese evento ocurra
     */
    on: (evento, callback) => {
      // Si el evento no existe se crea un array vacío
      if (!listeners[evento]) listeners[evento] = [];

      // Se guarda el callback dentro del evento
      listeners[evento].push(callback);
    },

    /**
     * emit = emitir / avisar que un evento ocurrió
     * @param {string} evento - nombre del evento
     * @param {string} data - info opcional que se quiere enviar
     */
    emit: (evento, data) => {
      // Si hay listeners registrados se recorren todos los callbacks asociados al evento
      if (listeners[evento])
        listeners[evento].forEach((callback) => {
          // Se ejecuta cada callback y se pasa la data como argumento
          callback(data);
        });
    },
  };
}

function crearCacheSimple(eventBus) {
  const datos = {};

  return {
    guardar: (clave, valor) => {
      datos[clave] = valor;
    },
    obtener: (clave) => {
      if (clave in datos) {
        eventBus.emit("cache:hit", clave);
        return datos[clave];
      } else {
        eventBus.emit("cache:miss", clave);
        return null;
      }
    },
  };
}

const bus = crearEventBus();

bus.on("cache:hit", (clave) => {
  console.log(`HIT en ${clave}`);
});

bus.on("cache:miss", (clave) => {
  console.log(`MISS en ${clave}`);
});

const cache = crearCacheSimple(bus);

cache.guardar("nombre", "Aldo");

console.log(cache.obtener("nombre"));
console.log(cache.obtener("edad"));
