# 🗂️ Día 5 — GitHub Flow con GitHub CLI

Este ejercicio simula el flujo de trabajo real de un desarrollador dentro de un equipo, utilizando **ramas feature**, **commits con convenciones**, **Pull Requests**, y **merge desde GitHub** usando el poder de **GitHub CLI (`gh`)**.

El objetivo principal es dominar el flujo moderno de colaboración basado en GitHub Flow, con herramientas profesionales para terminal e integraciones SSH.

---

## ✅ Objetivos del Día 5

- Configurar Git con buenas prácticas globales.
- Utilizar extensiones clave de VSCode (GitLens, Git Graph, Conventional Commits).
- Crear un proyecto nuevo siguiendo estructura mínima.
- Crear y trabajar en una rama `feature/`.
- Escribir código y test real.
- Realizar commits usando Conventional Commits.
- Subir los cambios al remoto.
- Crear un Pull Request usando GitHub CLI.
- Hacer merge del PR usando GitHub CLI.
- Limpiar ramas locales y remotas.
- Mantener el repositorio sincronizado con `main`.

---

## ✅ Configuraciones globales de Git

```bash
git config --global core.editor "code --wait"
git config --global init.defaultBranch main
git config --global pull.rebase false
```

---

## ✅ Alias opcionales (productividad)

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```

---

## ✅ Instalación de extensiones de VS Code

```bash
code --install-extension eamodio.gitlens
code --install-extension mhutchie.git-graph
code --install-extension vivaxy.vscode-conventional-commits
```

---

## ✅ Instalación y configuración de GitHub CLI

```bash
winget install --id GitHub.cli
gh auth login
```

**Configuración utilizada:**

- GitHub.com
- SSH
- Usar llave SSH existente (id_ed25519, registrada como Windows Aldo)
- Login con navegador
- Token almacenado en keyring

**Verificación:**

```bash
gh auth status
```

---

## ✅ Crear estructura del proyecto

```bash
mkdir ejercicio-dia-5
cd ejercicio-dia-5
mkdir src test
```

---

## ✅ Crear la funcionalidad y sus tests

**src/saludar.js**

```javascript
export function saludar(nombre) {
  return `Hola, ${nombre}`;
}
```

**test/saludar.test.js**

```javascript
import { saludar } from "../src/saludar.js";

test("saludar devuelve el mensaje correcto", () => {
  expect(saludar("Aldo")).toBe("Hola, Aldo");
});
```

---

## ✅ Crear la rama feature

```bash
git co -b feature/saludo
```

---

## ✅ Agregar y commitear cambios

```bash
git add .
git ci -m "feat(saludar): implementa función de saludo y test básico"
```

- ✅ Commit con convención Conventional Commits
- ✅ Rama bien nombrada
- ✅ Estructura clara

---

## ✅ Subir la rama al remoto

```bash
git push -u origin feature/saludo
```

---

## ✅ Crear Pull Request con GitHub CLI

```bash
gh pr create --fill
```

Esto generó un PR real en GitHub:

🔗 https://github.com/AldousTheWise/road-2-js-fs/pull/2

---

## ✅ Merge del Pull Request con GitHub CLI

```bash
gh pr merge --merge --delete-branch
```

Acciones realizadas automáticamente:

- ✅ Merge estilo “merge commit”
- ✅ Eliminación de rama remota
- ✅ Eliminación de rama local
- ✅ Cambio automático a main

**Salida destacada:**

```bash
✓ Merged pull request #2
✓ Deleted remote branch feature/saludo
✓ Deleted local branch feature/saludo
```

---

## ✅ Sincronizar main local

```bash
git checkout main
git pull origin main
```

---

## ✅ Resultado final

El repositorio quedó:

- ✅ con feature integrada
- ✅ con historial limpio
- ✅ sin ramas innecesarias
- ✅ sincronizado con GitHub
- ✅ con PR documentado
- ✅ con commit convencional correcto
- ✅ con funcionalidades y tests operativos

---

## ✅ Sobre el autor

👤 Aldo Yáñez
[@AldousTheWise](https://github.com/AldousTheWise)
