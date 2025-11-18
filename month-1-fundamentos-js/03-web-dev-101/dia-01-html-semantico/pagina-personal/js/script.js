const form = document.querySelector("#form-contacto");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // evita envío real
  let valido = true;

  // Resetea mensajes
  document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
  document.querySelector("#mensaje-exito").textContent = "";

  // Validación nombre
  const nombre = document.querySelector("#nombre");
  if (nombre.value.trim().length < 2) {
    document.querySelector("#error-nombre").textContent =
      "Ingresa tu nombre completo.";
    valido = false;
  }

  // Validación email
  const email = document.querySelector("#email");
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email.value)) {
    document.querySelector("#error-email").textContent =
      "Ingresa un correo electrónico válido.";
    valido = false;
  }

  // Validación teléfono
  const tel = document.querySelector("#telefono");
  if (tel.value && !/^[0-9+\-\s]{6,15}$/.test(tel.value)) {
    document.querySelector("#error-telefono").textContent =
      "Ingresa un número válido.";
    valido = false;
  }

  // Validación asunto
  const asunto = document.querySelector("#asunto");
  if (asunto.value === "") {
    document.querySelector("#error-asunto").textContent =
      "Selecciona un asunto.";
    valido = false;
  }

  // Validación mensaje
  const mensaje = document.querySelector("#mensaje");
  if (mensaje.value.trim().length < 10) {
    document.querySelector("#error-mensaje").textContent =
      "El mensaje debe tener al menos 10 caracteres.";
    valido = false;
  }

  if (valido) {
    document.querySelector("#mensaje-exito").textContent =
      "¡Mensaje enviado correctamente! 😊";
    form.reset();
  }
});
