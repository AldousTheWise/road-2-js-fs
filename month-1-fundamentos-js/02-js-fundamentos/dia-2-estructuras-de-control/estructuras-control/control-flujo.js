function validarFormulario(datos) {
  try {
    // 1. Verificar que el nombre no esté vacío:
    if (!datos.nombre || datos.nombre.trim() === "") {
      throw new Error("El nombre no puede estar vacío");
    }

    // 2. Validar email con expresión regular:
    const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patronEmail.test(datos.email)) {
      throw new Error("El correo electrónico no es válido.");
    }

    // 3. Verificar edad dentro del rango 18-99
    const edad = Number(datos.edad);
    if (isNaN(edad) || edad < 18 || edad > 99) {
      throw new Error("La edad debe ser un número entre 18 y 99 años");
    }

    // 4. Validar contraseña segura
    // Debe tener al menos 8 caracteres, una mayuscula, una minúscula, un número y un símbolo
    const patronPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!patronPass.test(datos.password)) {
      throw new Error(
        "La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo"
      );
    }

    // 6. SI todo está correcto
    console.log("Formulario válido. Registro exitoso");
    return true;
  } catch (error) {
    console.error(`Error en validación: ${error.message}`);
    return false;
  }
}

const usuario = {
  nombre: "Aldo Yáñez",
  email: "aldo.yanez01@gmail.com",
  edad: 41,
  password: "M1con2ras3ña",
};

validarFormulario(usuario);
