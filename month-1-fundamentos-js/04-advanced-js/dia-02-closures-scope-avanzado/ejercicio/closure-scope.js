// Creamos crearEventBus()
function crearEventBus() {
  const listeners = {};

  return {
    on: (evento, callback) => {
      if (!listeners[evento]) listeners[evento] = [];
      listeners[evento].push(callback);
    },

    emit: (evento, data) => {
      if (listeners[evento]) {
        listeners[evento].forEach((callback) => {
          callback(data);
        });
      }
    },
  };
}

/**
 * crearCache() es una función que crea un espacio en memoria para los datos.
 * @param {{ emit: function }} eventBus - objeto que emite eventos del caché.
 * @param { number } ttl - tiempo de vida del dato.
 * @param { number } maxSize - tamaño del array en donde se guardan las claves de los datos para referencia
 * @returns
 */
function crearCache(eventBus, ttl, maxSize) {
  const datos = {}; // Memoria privada (closure)
  const orden = []; // Array para FIFO
  let hits = 0;
  let misses = 0;

  return {
    guardar: (clave, valor) => {
      const index = orden.indexOf(clave);

      // Si la clave ya existe, se elimina
      // de la posición anterior (LRU)
      if (index !== -1) orden.splice(index, 1);

      // Se agrega al final (más recientemente usado)
      orden.push(clave);

      datos[clave] = {
        valor,
        expiraEn: Date.now() + ttl,
      };

      // Si el tamaño del array (orden.length) excede el
      // tamaño máximo permitido entonces eliminamos la
      // más antigua
      if (orden.length > maxSize) {
        const older = orden.shift(); // .shift() elimina el primer elemento del array
        delete datos[older]; // delete elimina una propiedad en un objeto
        eventBus.emit("cache:eviction", older);
      }
    },

    obtener: (clave) => {
      const item = datos[clave];

      if (!item || Date.now() > item.expiraEn) {
        misses++; // contador
        eventBus.emit("cache:miss", clave);
        return null;
      }

      const index = orden.indexOf(clave);

      if (index !== -1) {
        orden.splice(index, 1);
        orden.push(clave);
      }

      hits++; // contador
      eventBus.emit("cache:hit", clave);
      return item.valor;
    },

    stats: () => ({ hits, misses }),
  };
}

// Conectando el cache con EventBus
const bus = crearEventBus();

// Registramos los listeners
bus.on("cache:hit", (clave) => console.log("CACHE HIT:", clave));

bus.on("cache:miss", (clave) => console.log("CACHE MISS:", clave));

bus.on("cache:eviction", (clave) => console.log("CACHE EVICTED:", clave));

// Creamos el cache:
const cache = crearCache(bus, 5000, 2);

// Sistema en uso
cache.guardar("a", 1);
cache.guardar("b", 2);

cache.obtener("a"); // HIT
cache.guardar("c", 3); // eviction de "b"

cache.obtener("b"); // MISS
cache.obtener("a"); // HIT

console.log(cache.stats());
