// Helper para cambiar la primera letra a mayúscula
const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

/*== Botones == */

// Array de categorías
const categorias = ["todos", "naturaleza", "ciudad", "arte"];

// Captura de div 'controles' desde el HTML usando DOM
const controles = document.getElementById("controles");

// Inyección de HTML
controles.innerHTML = categorias
  .map(
    (categoria, index) => `
    <button class="filtro-btn ${
      index === 0 ? "active" : ""
    }" data-filtro="${categoria}"> ${
      categoria.charAt(0).toUpperCase() + categoria.slice(1)
    }</button>`
  )
  .join("");

/*== Galería de imágenes ==*/

// Array de objetos con atributos de las imágenes
const fotos = [
  {
    dataCategoria: "naturaleza",
    url: "https://images.unsplash.com/photo-1698517855306-63fa1d6e33f3?w=400",
    alt: "Bosque",
    tituloImagen: "Bosque Misterioso",
  },
  {
    dataCategoria: "ciudad",
    url: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=400",
    alt: "Ciudad nocturna",
    tituloImagen: "Ciudad Nocturna",
  },
  {
    dataCategoria: "arte",
    url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400", // Arte abstracto
    alt: "Arte abstracto",
    tituloImagen: "Arte Abstracto",
  },
  {
    dataCategoria: "naturaleza",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", // Picos nevados
    alt: "Montañas",
    tituloImagen: "Picos Nevados",
  },
  {
    dataCategoria: "ciudad",
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400", // Rascacielos
    alt: "Rascacielos",
    tituloImagen: "Rascacielos",
  },
  {
    dataCategoria: "arte",
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", // Pintura moderna
    alt: "Pintura",
    tituloImagen: "Pintura Moderna",
  },
  {
    dataCategoria: "naturaleza",
    url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400", // Playa Tropical
    alt: "Playa",
    tituloImagen: "Playa Tropical",
  },
  {
    dataCategoria: "ciudad",
    url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400", // Puente urbano
    alt: "Puente",
    tituloImagen: "Puente Urbano",
  },
];

// Captura del elemento 'galeria' desde el DOM
const galeria = document.getElementById("galeria");

// Inyección de HTML
galeria.innerHTML = fotos
  .map(
    (foto) => `
    <div class="imagen-item" data-categoria="${foto.dataCategoria}">
      <img src= "${foto.url}" alt="${foto.alt}">
      <div class="contenido-imagen">
        <h3 class="titulo-imagen">${foto.tituloImagen}</h3>
        <span class="categoria">${capitalize(foto.dataCategoria)}</span>
      </div>
    </div>`
  )
  .join(" ");

/*== SISTEMA DE FILTRADO ==*/

// Captura de elementos desde el DOM
const botonesFiltro = document.querySelectorAll(".filtro-btn");
const imagenes = document.querySelectorAll(".imagen-item");

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    // Remover clase active de todos los botones
    botonesFiltro.forEach((btn) => btn.classList.remove("active"));

    // Agregar clase al botón clickeado
    boton.classList.add("active");

    const filtro = boton.dataset.filtro;

    imagenes.forEach((imagen) => {
      if (filtro === "todos" || imagen.dataset.categoria === filtro) {
        imagen.classList.remove("oculto");
      } else {
        imagen.classList.add("oculto");
      }
    });
  });
});

/*== SISTEMA DE MODAL ==*/

// Captura del DOM
const modal = document.getElementById("modal");
const modalImagen = document.getElementById("modal-imagen");
const cerrarModal = document.getElementById("cerrar-modal");

imagenes.forEach((imagen) => {
  imagen.addEventListener("click", () => {
    const imgSrc = imagen.querySelector("img").src;
    modalImagen.src = imgSrc.replace("w=400", "w=800");
    modal.classList.add("activo");
  });
});

cerrarModal.addEventListener("click", () => {
  modal.classList.remove("activo");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("activo");
  }
});

// Cerrar modal con tecla escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("activo")) {
    modal.classList.remove("activo");
  }
});
