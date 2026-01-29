# API Express con Middlewares Avanzados

Este proyecto consiste en una API REST desarrollada con Node.js y Express, enfocada en la implementación de una cadena de middlewares para la gestión de seguridad, validación y optimización de recursos.

## Tecnologías y Extensiones

El sistema extiende su funcionalidad base mediante la integración de los siguientes componentes:

1.  **Seguridad**: Implementación de `helmet` para cabeceras HTTP seguras y `cors` para la gestión de acceso cruzado.
2.  **Rendimiento**: Uso de `compression` para la reducción del tamaño de las respuestas y `node-cache` para el almacenamiento temporal de datos en memoria.
3.  **Validación de Datos**: Integración de `Joi` para la validación de esquemas de entrada en peticiones POST.
4.  **Internacionalización (i18n)**: Configuración de `i18next` para la detección de idioma y traducción de mensajes de error.
5.  **Control de Tasa (Rate Limiting)**: Uso de `express-rate-limit` para restringir el número de peticiones por ruta.

## Instalación

1. Descargue o clone el repositorio.
2. Instale las dependencias necesarias mediante el gestor de paquetes:
   ```bash
   npm install
   ```

## Scripts de ejecución

- **Producción**

```bash
npmstart
```

- **Desarrollo**

```bash
npm run dev
```

- **Pruebas**

```bash
npm test
```

## Suite de Pruebas

El archivo `test.server.js` utiliza Supertest para verificar de forma automatizada los siguientes puntos:

- Rechazo de datos inválidos mediante Joi.
- Respuesta de errores en diferentes idiomas (ES/EN) según cabeceras.
- Entrega de datos desde el middleware de caché.
- Activación del bloqueo por exceso de peticiones (429 Too Many Requests).

## Estructura de Endpoints

- `POST /auth/login`: Autenticación de usuarios con límite de intentos.
- `GET /api/productos`: Consulta de catálogo con soporte para filtros por query strings y caché de 30 segundos.
- `POST /api/productos`: Registro de nuevos productos con validación de esquema y limpieza de caché.
- `GET /api/usuarios`: Consulta de usuarios protegida por autenticación y caché de 60 segundos.
- `GET /health`: Diagnóstico del estado y tiempo de actividad del servidor.

Proyecto desarrollado para la práctica avanzada de gestión de middlewares en entornos Node.js.
