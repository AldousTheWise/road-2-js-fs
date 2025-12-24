const APIs = {
  validarUsuario: (userId) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userId > 0) {
          resolve({
            id: userId,
            nombre: `Usuario ${userId}`,
            email: `user${userId}@example.com`,
          });
        } else {
          reject(new Error("Usuario no encontrado"));
        }
      }, 300);
    }),

  verificarInventario: (productos) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const productosDisponibles = productos.filter((p) => p.stock > 0);
        if (productosDisponibles.length === productos.length) {
          resolve({ disponible: true, productos });
        } else {
          reject(new Error("Algunos productos no están disponibles"));
        }
      }, 500);
    }),

  procesarPago: (monto) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (monto > 0 && monto < 10000) {
          resolve({
            aprobado: true,
            transaccionId: "txn_" + Date.now(),
            monto,
          });
        } else {
          reject(new Error("Monto de pago inválido"));
        }
      }, 800);
    }),

  crearOrden: (pedido, usuario) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "ord_" + Date.now(),
          usuarioId: usuario.id,
          productos: pedido.productos,
          total: pedido.total,
          fecha: new Date(),
        });
      }, 400);
    }),

  enviarEmail: (email, orden) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.includes("@")) {
          resolve({
            enviado: true,
            destinatario: email,
            ordenId: orden.id,
          });
        } else {
          reject(new Error("Email inválido"));
        }
      }, 600);
    }),
};

class ProcesadorPedidos {
  constructor() {
    this.estadisticas = {
      procesados: 0,
      exitosos: 0,
      fallidos: 0,
      tiempoPromedio: 0,
    };
  }

  async procesarPedidoSecuencial(pedido) {
    const inicio = Date.now();

    try {
      console.log(`Iniciando procesamiento secuencial del pedido`);

      // Validar usuario
      const usuario = await APIs.validarUsuario(pedido.usuarioId);
      console.log(`Usuario validado: ${usuario.nombre}`);

      // Verificar inventario
      const inventario = await APIs.verificarInventario(pedido.productos);
      console.log(`Inventario verificado`);

      // Procesar pago
      const pago = await APIs.procesarPago(pedido.total);
      console.log(`Pago procesado: $${pago.monto}`);

      // Crear orden
      const orden = await APIs.crearOrden(pedido, usuario);
      console.log(`Orden creada: ${orden.id}`);

      // Enviar email
      const email = await APIs.enviarEmail(usuario.email, orden);
      console.log(`Email enviado a: ${email.destinatario}`);

      const tiempoTotal = Date.now() - inicio;
      this.actualizarEstadisticas(true, tiempoTotal);

      return {
        exito: true,
        orden,
        tiempoProcesamiento: tiempoTotal,
      };
    } catch (error) {
      const tiempoTotal = Date.now() - inicio;
      this.actualizarEstadisticas(false, tiempoTotal);

      console.error(`Error en procesamiento: ${error.message}`);
      return {
        exito: false,
        error: error.message,
        tiempoProcesamiento: tiempoTotal,
      };
    }
  }

  // Procesamiento optimizado con Promise.all
  async procesarPedidoOptimizado(pedido) {
    const inicio = Date.now();

    try {
      console.log(`Iniciando procesamiento optimizado del pedido`);

      // Validar usuario
      const usuario = await APIs.validarUsuario(pedido.usuarioId);
      console.log(`Usuario validado: ${usuario.nombre}`);

      // Procesar pago y verificar usuario en paralelo
      const [pago, inventario] = await Promise.all([
        APIs.procesarPago(pedido.total),
        APIs.verificarInventario(pedido.productos),
      ]);

      console.log(`Pago procesado: $${pago.monto}`);
      console.log(`Inventario verificado`);

      // Crear orden y enviar email en paralelo
      const [orden, email] = await Promise.all([
        APIs.crearOrden(pedido, usuario),
        APIs.enviarEmail(usuario.email, pedido),
      ]);

      console.log(`Orden creada: ${orden.id}`);
      console.log(`Email enviado a: ${email.destinatario}`);

      const tiempoTotal = Date.now() - inicio;
      this.actualizarEstadisticas(true, tiempoTotal);

      return {
        exito: true,
        orden,
        tiempoProcesamiento: tiempoTotal,
        estrategia: "optimizada",
      };
    } catch (error) {
      const tiempoTotal = Date.now() - inicio;
      this.actualizarEstadisticas(false, tiempoTotal);

      console.error(`Error en procesamiento optimizado: ${error.message}`);

      return {
        exito: false,
        error: error.message,
        tiempoProcesamiento: tiempoTotal,
        estrategia: "optimizada",
      };
    }
  }

  // Procesamiento con recuperación automática
  async procesarPedidoResiliente(pedido) {
    console.log(`Iniciando procesamiento resiliente del pedido`);

    // Intentar procesamiento optimizado primero
    let resultado = await this.procesarPedidoOptimizado(pedido);

    if (!resultado.exito) {
      console.log(`Falló procesamiento optimizado, intentando secuencial`);

      resultado = await this.procesarPedidoSecuencial(pedido);
    }

    return resultado;
  }

  // Estadisticas
  actualizarEstadisticas(exito, tiempo) {
    this.estadisticas.procesados++;

    if (exito) {
      this.estadisticas.exitosos++;
    } else {
      this.estadisticas.fallidos++;
    }

    // Calcular tiempo promedio
    const totalTiempo =
      this.estadisticas.tiempoPromedio * (this.estadisticas.procesados - 1) +
      tiempo;
    this.estadisticas.tiempoPromedio =
      totalTiempo / this.estadisticas.procesados;
  }

  obtenerEstadisticas() {
    return {
      ...this.estadisticas,
      tiempoPromedio: Math.round(this.estadisticas.tiempoPromedio),
    };
  }
}

// Demo del sistema
async function demostrarSistemaPedidos() {
  const procesador = new ProcesadorPedidos();

  const pedidos = [
    {
      usuarioId: 1,
      productos: [
        { nombre: "Producto A", stock: 5 },
        { nombre: "Producto B", stock: 3 },
      ],
      total: 150,
    },
    {
      usuarioId: 2,
      productos: [
        { nombre: "Producto C", stock: 0 },
        { nombre: "Producto D", stock: 2 },
      ],
      total: 200,
    },
    {
      usuario: -1,
      productos: [{ nombre: "Producto E", stock: 1 }],
      total: 50,
    },
  ];

  console.log("DEMO: SISTEMA DE PROCESAMIENTO DE PEDIDOS\n");

  for (let i = 0; i < pedidos.length; i++) {
    console.log(`\nProcesando pedido ${i + 1}/${pedidos.length}`);

    // Usar estrategia resiliente para todos los pedidos
    const resultado = await procesador.procesarPedidoResiliente(pedidos[i]);

    if (resultado.exito) {
      console.log(`Pedido completado en ${resultado.tiempoProcesamiento}ms`);
    } else {
      console.log(`Pedido fallido: ${resultado.error}`);
    }
  }

  console.log("\nESTADÍSTICAS FINALES:");
  console.log(procesador.obtenerEstadisticas());
}

demostrarSistemaPedidos();
