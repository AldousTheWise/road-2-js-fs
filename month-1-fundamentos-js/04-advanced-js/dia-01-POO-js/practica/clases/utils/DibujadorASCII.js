// Visitor Pattern para dibujar figuras ASCII con relación de aspecto correcta
export class DibujadorASCII {
  #ancho;
  #alto;
  #relacionAspecto = 2.0; // Caracteres son ~2x más altos que anchos

  constructor(ancho = 20, alto = 10) {
    this.#ancho = Math.min(ancho, 60);
    this.#alto = Math.min(alto, 30);
  }

  // Visitor Patterns
  visitarCirculo(circulo) {
    const canvas = this.#crearCanvas();
    this.#dibujarCirculo(canvas, circulo.radio);
    return `Círculo (radio: ${circulo.radio})\n${this.#canvasAString(canvas)}`;
  }

  visitarRectangulo(rectangulo) {
    const canvas = this.#crearCanvas();
    this.#dibujarRectangulo(canvas, rectangulo.ancho, rectangulo.altura);

    const esCuadrado = rectangulo.ancho === rectangulo.altura;
    const tipo = esCuadrado ? "Cuadrado" : "Rectángulo";

    return `${tipo} (${rectangulo.ancho}x${
      rectangulo.altura
    })\n${this.#canvasAString(canvas)}`;
  }

  visitarTriangulo(triangulo) {
    const canvas = this.#crearCanvas();
    this.#dibujarTriangulo(canvas, triangulo.base, triangulo.altura);

    return `Triángulo (base: ${triangulo.base}, altura: ${
      triangulo.altura
    })\n${this.#canvasAString(canvas)}`;
  }

  visitarPentagono(pentagono) {
    const canvas = this.#crearCanvas();
    this.#dibujarPoligono(canvas, 5, pentagono.lado, "P");
    return `Pentágono (lado: ${pentagono.lado})\n${this.#canvasAString(
      canvas
    )}`;
  }

  visitarHexagono(hexagono) {
    const canvas = this.#crearCanvas();
    this.#dibujarPoligono(canvas, 6, hexagono.lado, "H");
    return `Hexágono (lado: ${hexagono.lado})\n${this.#canvasAString(canvas)}`;
  }

  visitarEsfera(esfera) {
    const canvas = this.#crearCanvas();
    this.#dibujarEsfera(canvas, esfera.radio);
    return `Esfera (radio: ${esfera.radio}\n${this.#canvasAString(canvas)})`;
  }

  visitarCubo(cubo) {
    const canvas = this.#crearCanvas();
    this.#dibujarCubo(canvas, cubo.lado);
    return `Cubo (lado: ${cubo.lado})\n${this.#canvasAString(canvas)}`;
  }
  // Métodos privados
  #crearCanvas() {
    const canvas = [];
    for (let y = 0; y < this.#alto; y++) {
      canvas[y] = Array(this.#ancho).fill(" ");
    }
    return canvas;
  }

  #canvasAString(canvas) {
    return canvas.map((fila) => fila.join("")).join("\n");
  }

  #dibujarCirculo(canvas, radio) {
    const centroX = this.#ancho / 2;
    const centroY = this.#alto / 2;
    // Ajustar radio por relación de aspecto
    const radioEscaladoX = Math.min(this.#ancho, this.#alto) / 3;
    const radioEscaladoY = radioEscaladoX / this.#relacionAspecto;

    for (let y = 0; y < this.#alto; y++) {
      for (let x = 0; x < this.#ancho; x++) {
        // Fórmula de elipse (círculo ajustado)
        const dx = (x - centroX) / radioEscaladoX;
        const dy = (y - centroY) / radioEscaladoY;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (Math.abs(distancia - 1) < 0.3) {
          // Borde
          canvas[y][x] = "O";
        } else if (distancia < 1) {
          // Interior
          canvas[y][x] = ".";
        }
      }
    }
  }

  #dibujarRectangulo(canvas, ancho, alto) {
    // Ajustar altura por relación de aspecto
    const altoAjustado = alto / this.#relacionAspecto;
    const escala =
      Math.min(this.#ancho / ancho, this.#alto / altoAjustado) * 0.7;

    const anchoDibujo = Math.floor(ancho * escala);
    const altoDibujo = Math.floor(altoAjustado * escala);

    const inicioX = Math.floor((this.#ancho - anchoDibujo) / 2);
    const inicioY = Math.floor((this.#alto - altoDibujo) / 2);

    for (let y = inicioY; y < inicioY + altoDibujo && y < this.#alto; y++) {
      for (let x = inicioX; x < inicioX + anchoDibujo && x < this.#ancho; x++) {
        const enBorde =
          y === inicioY ||
          y === inicioY + altoDibujo - 1 ||
          x === inicioX ||
          x === inicioX + anchoDibujo - 1;

        canvas[y][x] = enBorde ? "#" : " ";
      }
    }
  }

  #dibujarTriangulo(canvas, base, altura) {
    // Ajustar altura por relación de aspecto
    const alturaAjustada = altura / this.#relacionAspecto;
    const escala =
      Math.min(this.#ancho / base, this.#alto / alturaAjustada) * 0.6;

    const baseDibujo = Math.floor(base * escala);
    const alturaDibujo = Math.floor(alturaAjustada * escala);

    const inicioX = Math.floor((this.#ancho - baseDibujo) / 2);
    const inicioY = Math.floor((this.#alto - alturaDibujo) / 2);

    for (
      let nivel = 0;
      nivel < alturaDibujo && nivel + inicioY < this.#alto;
      nivel++
    ) {
      const anchoNivel = Math.floor((nivel + 1) * (baseDibujo / alturaDibujo));
      const margen = Math.floor((baseDibujo - anchoNivel) / 2);

      for (
        let i = 0;
        i < anchoNivel && inicioX + margen + i < this.#ancho;
        i++
      ) {
        const x = inicioX + margen + i;
        const y = inicioY + nivel;

        // Solo bordes
        const enBase = nivel === alturaDibujo - 1;
        const enBordeIzquierdo = i === 0;
        const enBordeDerecho = i === anchoNivel - 1;

        if (enBase || enBordeIzquierdo || enBordeDerecho) {
          canvas[y][x] = "^";
        }
      }
    }
  }

  #dibujarPoligono(canvas, lados, lado, caracter) {
    const centroX = Math.floor(this.#ancho / 2);
    const centroY = Math.floor(this.#alto / 2);
    const radio = Math.min(centroX, centroY) - 1;

    // Para polígonos pequeños, usar representación simple
    if (lados === 5) {
      this.#dibujarPentagonoCanvas(canvas, centroX, centroY, radio, caracter);
    } else if (lados === 6) {
      this.#dibujarHexagonoCanvas(canvas, centroX, centroY, radio, caracter);
    }
  }

  #dibujarPentagonoCanvas(canvas, cx, cy, radio, caracter) {
    // Pentágono: puntos específicos para mejor visualización
    const puntos = [
      [cx, cy - radio], // Arriba
      [cx + Math.floor(radio * 0.95), cy - Math.floor(radio * 0.3)],
      [cx + Math.floor(radio * 0.6), cy + Math.floor(radio * 0.8)],
      [cx - Math.floor(radio * 0.6), cy + Math.floor(radio * 0.8)],
      [cx - Math.floor(radio * 0.95), cy - Math.floor(radio * 0.3)],
    ];

    // Conectar con líneas más gruesas
    for (let i = 0; i < 5; i++) {
      const [x1, y1] = puntos[i];
      const [x2, y2] = puntos[(i + 1) % 5];
      this.#dibujarLineaGruesa(canvas, x1, y1, x2, y2, caracter);
    }
  }

  #dibujarHexagonoCanvas(canvas, cx, cy, radio, caracter) {
    // Hexágono: más simétrico
    const puntos = [
      [cx, cy - radio], // Arriba
      [cx + radio, cy - Math.floor(radio / 2)],
      [cx + radio, cy + Math.floor(radio / 2)],
      [cx, cy + radio], // Abajo
      [cx - radio, cy + Math.floor(radio / 2)],
      [cx - radio, cy - Math.floor(radio / 2)],
    ];

    for (let i = 0; i < 6; i++) {
      const [x1, y1] = puntos[i];
      const [x2, y2] = puntos[(i + 1) % 6];
      this.#dibujarLineaGruesa(canvas, x1, y1, x2, y2, caracter);
    }
  }

  #dibujarLineaGruesa(canvas, x1, y1, x2, y2, caracter) {
    // Línea más gruesa para mejor visibilidad
    const dx = x2 - x1;
    const dy = y2 - y1;
    const pasos = Math.max(Math.abs(dx), Math.abs(dy));

    for (let i = 0; i <= pasos; i++) {
      const t = i / pasos;
      const x = Math.round(x1 + dx * t);
      const y = Math.round(y1 + dy * t);

      // Marcar punto principal
      if (x >= 0 && x < this.#ancho && y >= 0 && y < this.#alto) {
        canvas[y][x] = caracter;
      }

      // Marcar puntos adyacentes para hacerla más gruesa
      if (x + 1 >= 0 && x + 1 < this.#ancho && y >= 0 && y < this.#alto) {
        canvas[y][x + 1] = caracter;
      }
      if (x >= 0 && x < this.#ancho && y + 1 >= 0 && y + 1 < this.#alto) {
        canvas[y + 1][x] = caracter;
      }
    }
  }

  #dibujarEsfera(canvas, radio) {
    const centroX = Math.floor(this.#ancho / 2);
    const centroY = Math.floor(this.#alto / 2);
    const radioDibujo = Math.min(centroX, centroY) - 1;

    for (let y = 0; y < this.#alto; y++) {
      for (let x = 0; x < this.#ancho; x++) {
        const dx = x - centroX;
        const dy = y - centroY;
        const distancia = Math.sqrt(dx * dx + dy * dy * 4);

        if (Math.abs(distancia - radioDibujo) < 1.0) {
          canvas[y][x] = "O";
        } else if (distancia < radioDibujo) {
          const intensidad = Math.floor((1 - distancia / radioDibujo) * 3);
          const caracteres = [".", "o", "O"];
          canvas[y][x] = caracteres[Math.min(intensidad, 2)];
        }
      }
    }
  }

  #dibujarCubo(canvas, lado) {
    const tamano = Math.min(6, Math.floor(lado));
    const centroX = Math.floor(this.#ancho / 2);
    const centroY = Math.floor(this.#alto / 2);

    const inicioX = centroX - Math.floor(tamano / 2);
    const inicioY = centroY - Math.floor(tamano / 2);

    for (let y = 0; y < tamano; y++) {
      for (let x = 0; x < tamano; x++) {
        const canvasX = inicioX + x;
        const canvasY = inicioY + y;

        if (
          canvasX >= 0 &&
          canvasX < this.#ancho &&
          canvasY >= 0 &&
          canvasY < this.#alto
        ) {
          canvas[canvasY][canvasX] = "#";
        }
      }
    }

    for (let y = 0; y < tamano; y++) {
      for (let x = 0; x < Math.floor(tamano / 2); x++) {
        const canvasX = inicioX + tamano + x;
        const canvasY = inicioY + y;

        if (
          canvasX >= 0 &&
          canvasX < this.#ancho &&
          canvasY >= 0 &&
          canvasY < this.#alto
        ) {
          canvas[canvasY][canvasX] = "|";
        }
      }
    }

    for (let x = 0; x < tamano; x++) {
      for (let y = 0; y < Math.floor(tamano / 2); y++) {
        const canvasX = inicioX + x + Math.floor(x / 3);
        const canvasY = inicioY - y - 1;

        if (
          canvasX >= 0 &&
          canvasX < this.#ancho &&
          canvasY >= 0 &&
          canvasY < this.#alto
        ) {
          canvas[canvasY][canvasX] = "-";
        }
      }
    }
  }

  get dimensiones() {
    return { ancho: this.#ancho, alto: this.#alto };
  }
}
