async function conReintentos(fn, intentos = 3, delayMs = 500) {
  for (let i = 1; i <= intentos; i++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(`Intento ${i} falló: ${error.message}`);

      if (i === intentos) {
        throw error;
      }

      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}

const crearMetricas = () => {
  return {
    inicio: Date.now(),
    paginas: [],
    errores: 0,

    registrarPagina({ url, duracionMs, ok }) {
      this.paginas.push({ url, duracionMs, ok });
      if (!ok) this.errores++;
    },

    resumen() {
      const total = Date.now() - this.inicio;

      return {
        tiempoTotalMs: total,
        paginasProcesadas: this.paginas.length,
        exitosas: this.paginas.filter((p) => p.ok).length,
        fallidas: this.errores,
        promedioMs:
          this.paginas.reduce((a, p) => a + p.duracionMs, 0) /
          this.paginas.length,
      };
    },
  };
};

const medirAsync = (fn, metricas, url) => {
  return async () => {
    const inicio = Date.now();
    try {
      const resultado = await fn();
      metricas.registrarPagina({
        url,
        duracionMs: Date.now() - inicio,
        ok: true,
      });

      return resultado;
    } catch (error) {
      metricas.registrarPagina({
        url,
        duracionMs: Date.now() - inicio,
        ok: false,
      });

      throw error;
    }
  };
};

const generarUrls = (paginas) => {
  return Array.from(
    { length: paginas },
    (_, i) => `https://quotes.toscrape.com/page/${i + 1}/`
  );
};

async function scrapearPagina(url) {
  try {
    console.log(`Visitando ${url}...`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Extracción básica
    const quoteRegex =
      /<span class="text".*?>(.*?)<\/span>[\s\S]*?<small class="author".*?>(.*?)<\/small>/g;

    const quotes = [];
    let match;

    while ((match = quoteRegex.exec(html)) !== null) {
      quotes.push({
        text: match[1].replace(/&ldquo;|&rdquo;/g, '"'),
        author: match[2],
      });
    }

    return quotes;
  } catch (error) {
    throw new Error(`Fallo en ${url}: ${error.message}`);
  }
}

const metricasMultiPaginas = crearMetricas();

async function scrapearMultiplesPaginas(urls) {
  const promesas = urls.map((url) =>
    conReintentos(
      medirAsync(() => scrapearPagina(url), metricasMultiPaginas, url),
      3
    )
  );

  const resultados = await Promise.allSettled(promesas);

  return resultados;
}

const metricasRateLimit = crearMetricas();

async function scrapearConRateLimit(urls, limite = 2) {
  const resultados = [];

  for (let i = 0; i < urls.length; i += limite) {
    const lote = urls.slice(i, i + limite);

    const promesas = lote.map((url) =>
      conReintentos(
        medirAsync(() => scrapearPagina(url), metricasRateLimit, url),
        3
      )
    );

    const parcial = await Promise.allSettled(promesas);

    resultados.push(...parcial);

    await new Promise((res) => setTimeout(res, 500));
  }

  return resultados;
}

const metricasStream = crearMetricas();

async function* streamScraping(urls) {
  for (const url of urls) {
    try {
      const quotes = await conReintentos(
        medirAsync(() => scrapearPagina(url), metricasStream, url),
        3
      );

      yield { url, quotes };
    } catch (error) {
      yield { url, error };
    }
  }
}

(async () => {
  const urls = generarUrls(3);

  const resultados = await scrapearConRateLimit(urls, 2);

  let totalQuotes = 0;

  resultados.forEach((resultado, index) => {
    if (resultado.status === "fulfilled") {
      console.log(`Pagina ${index + 1}: OK`);
      totalQuotes += resultado.value.length;
    } else {
      console.log(`Página ${index + 1}: FALLÓ`);
      console.error(resultado.reason.message);
    }
  });

  console.log("TOTAL DE CITAS:", totalQuotes);

  const reporte = metricasRateLimit.resumen();

  console.log("REPORTE DE RENDIMIENTO (Rate Limit)");
  console.table(reporte);
})();

(async () => {
  const urls = generarUrls(3);
  let totalQuotes = 0;

  for await (const resultado of streamScraping(urls)) {
    if (resultado.error) {
      console.log(`Falló ${resultado.url}`);
    } else {
      console.log(`${resultado.url}`);
      totalQuotes += resultado.quotes.length;
    }
  }

  console.log("TOTAL DE CITAS:", totalQuotes);

  const reporte = metricasStream.resumen();

  console.log("REPORTE DE RENDIMIENTO (Stream)");
  console.table(reporte);
})();
