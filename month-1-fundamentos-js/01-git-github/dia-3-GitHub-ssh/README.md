# Día 3 — GitHub + SSH + Flujo de Trabajo con Ramas

Este ejercicio demuestra la configuración y uso de Git y SSH para trabajar con GitHub, junto con el flujo completo de colaboración mediante ramas y Pull Requests.

---

## 🎯 Objetivos del ejercicio

- Verificar configuración de Git
- Configurar acceso SSH con GitHub
- Crear una rama de trabajo
- Realizar cambios y commits
- Subir rama al repositorio remoto (push)
- Crear un Pull Request en GitHub
- Hacer merge a `main`
- Sincronizar cambios en la máquina local

---

## ✅ Comandos ejecutados

### Verificar configuración global

```bash
git config --global user.name
git config --global user.email
```

### Crear llave SSH (solo una vez)

```bash
ssh-keygen -t ed25519 -C "aldo.yanez01@gmail.com"
```

### Activar y cargar ssh-agent (Windows)

```bash
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent
ssh-add $env:USERPROFILE\.ssh\id_ed25519
```

### Probar conexión con GitHub

```bash
ssh -T git@github.com
```

_Result:_

```bash
Hi AldousTheWise! You've successfully authenticated, but GitHub does not provide shell access.
```

| ✅ SSH funcionando

---

## 🧪 Flujo Git con ramas

### Crear nueva rama

```bash
git checkout -b feature/git-practice
```

### Crear archivo de prueba

```bash
echo "Práctica de ramas y SSH en GitHub." > ssh-practice.txt
```

### Agregar y commitear

```bash
git add ssh-practice.txt
git commit -m "feat: agregar archivo ssh-practice"
```

### Subir rama a GitHub

```bash
git push -u origin feature/git-practice
```

| GitHub sugiere automáticamente abrir un Pull Request

---

## 🔁 Merge y sincronización

## Volver a `main` y traer cambios

```bash
git checkout main
git pull
```

| Pull realizado exitosamente después del merge en GitHub.

---

## 📌 Resultado

- SSH configurado y funcionando
- Rama creada y enviada correctamente
- Pull Request y merge completado
- Proyecto sincronizado sin conflictos

Este flujo es equivalente al utilizado en proyectos colaborativos reales.

---

### 📝 Archivo generado

```bash
|      Archivo        |      Descripción                              |
|---------------------|-----------------------------------------------|
|ssh-practice.txt	  | Archivo de prueba creado durante el ejercicio |
```

### 🧠 Aprendizaje obtenido

- Configurar SSH en GitHub
- Usar ssh-agent en Windows
- Crear y usar ramas como en entornos profesionales
- Realizar commits semánticos
- Enviar ramas a GitHub (push)
- Abrir PR y hacer merge correctamente
- Sincronizar repos local y remoto

| Este ejercicio demuestra un flujo completo de trabajo profesional con Git y GitHub.
