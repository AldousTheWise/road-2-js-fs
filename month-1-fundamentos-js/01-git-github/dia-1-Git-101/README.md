# Ejercicio 1: Simulación de Flujo Colaborativo en Git

Este ejercicio simula un escenario real de trabajo en equipo donde un desarrollador:

1. Crea un proyecto nuevo
2. Inicializa control de versiones
3. Versiona cambios de forma incremental
4. Revisa diferencias entre versiones
5. Realiza rollback temporal a un commit anterior

El objetivo es internalizar el flujo típico de desarrollo profesional en Git.

## 🎯 Objetivo

Demostrar por qué Git es esencial en entornos colaborativos, incluso en cambios simples, y practicar comandos fundamentales.

## 🛠️ Pasos realizados

```bash
# Crear proyecto
mkdir proyecto-colaborativo-simulado
cd proyecto-colaborativo-simulado

# Inicializar Git
git init

# Archivo inicial
echo "console.log('Hola Mundo');" > app.js

git add app.js
git commit -m "feat: inicializar proyecto con log básico"

# Agregar nueva funcionalidad
echo "
// Función para saludar
function saludar(nombre) {
  console.log(\`Hola, \${nombre}!\`);
}
saludar('Desarrollador');
" >> app.js

git add app.js
git commit -m "feat: agregar función de saludo personalizado"

# Ver historial
git log --oneline

# Simular rollback temporal
git checkout HEAD~1
cat app.js

# Volver a HEAD
git checkout main
cat app.js
```

## ✅ Resultados observados

- Cada cambio quedó documentado.
- Se puede comparar entre versiones.
- Se puede retroceder sin perder trabajo.
- Commits semánticos facilitan lectura del historial.

## 💡 Reflexión

Este flujo es la base de todo desarrollo moderno:

- Se versionan cambios pequeños y frecuentes
- Se escriben mensajes claros y útiles
- Se puede retroceder en caso de errores
- Permite a otros entender la evolución del código
