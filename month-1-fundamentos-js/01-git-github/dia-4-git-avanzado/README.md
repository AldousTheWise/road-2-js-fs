# 🗂️ Día 4 — Git Avanzado: Resolución de Conflictos

Este ejercicio consistió en crear dos ramas (`rama-A` y `rama-B`), realizar cambios diferentes sobre el **mismo archivo**, provocar un conflicto al intentar fusionarlas y luego resolver ese conflicto de **tres formas distintas**:

1. ✅ Quedarse con la versión de A
2. ✅ Quedarse con la versión de B
3. ✅ Combinar ambas versiones

Además, se registró todo el flujo en un archivo de transcripción generado desde PowerShell.

---

## 📁 Estructura del directorio

```bash
month-1-fundamentos-js/
└── 01-git-github/
└── dia-4-git-avanzado/
   ├── mensaje.txt
   |_ dia-4-transcripcion.txt
   |_ README.md

```

---

## ✅ 1. Crear archivo base en `main`

Se creó el archivo `mensaje.txt` y se añadió contenido inicial:

```bash
Mensaje inicial del ejercicio
```

**Commit:**

```bash
git add mensaje.txt
git commit -m "feat(dia 4): archivo base en UTF-8 para simulación de conflictos"
```

---

## ✅ 2. Crear rama A y modificar el archivo

```bash
git checkout -b rama-A
```

**Se actualizó el archivo:**

```bash
Mensaje modificado desde rama A.
```

**Commit:**

```bash
git add mensaje.txt
git commit -m "feat(dia 4): Cambio desde rama A"
```

---

## ✅ 3. Crear rama B y modificar el archivo con otro contenido

**Volver a main:**

```bash
git checkout main
git checkout -b rama-B
```

**Contenido de B:**

```bash
Mensaje diferente desde rama B
```

**Commit:**

```bash
git add mensaje.txt
git commit -m "feat(dia 4): Cambio desde rama B"
```

---

## ✅ 4. Fusionar rama-A → main (sin conflicto)

```bash
git checkout main
git merge rama-A
```

**✅ Merge exitoso.**

--

## ✅ 5. Fusionar rama-B → main (genera conflicto)

```bash
git merge rama-B
```

**Resultado:**

```bash
<<<<<<< HEAD
Mensaje modificado desde rama A.
=======
Mensaje diferente desde rama B
>>>>>>> rama-B
```

## ✅ 6. Resolución de Conflictos

El conflicto se resolvió tres veces, usando git reset para volver atrás y repetir el ejercicio.

### ✅ A) Mantener solo versión A

**Archivo final:**

```bash
Mensaje modificado desde rama A.
```

**Commit:**

```bash
git add mensaje.txt
git commit -m "fix(dia 4): resolver conflicto manteniendo version A"
```

### ✅ B) Mantener solo versión B

**Se volvió al punto previo:**

```bash
git reset --hard HEAD~1
```

**Archivo final:**

```bash
Mensaje diferente desde rama B
```

**Commit:**

```bash
Copiar código
git add mensaje.txt
git commit -m "fix(dia 4): resolver conflicto manteniendo version B"
```

### ✅ C) Combinar ambas versiones

**De nuevo se retrocedió:**

```bash
git reset --hard HEAD~1
```

**Archivo final:**

```bash
Mensaje modificado desde rama A.
Mensaje diferente desde rama B
```

**Commit:**

```bash
git add mensaje.txt
git commit -m "fix(dia 4): resolver conflicto combinando versiones"
```

## ✅ 7. Transcripción del ejercicio

Durante el ejercicio se utilizó PowerShell 5.1 para registrar la sesión completa.

Esto generó un archivo con:

- salida detallada de comandos
- timestamps
- creación de ramas
- commits
- errores y correcciones
- merges y resets

Ubicación del archivo:

```bash
dia-4-git-avanzado\dia-4-transcripcion.txt
```

**⚠️ Nota: PowerShell 5.1 codifica la transcripción en ANSI, lo que puede provocar reemplazos de acentos por signos “?”.**

## ✅ 8. Autor

Aldo Yáñez — [@AldousTheWise](https://github.com/AldousTheWise)
