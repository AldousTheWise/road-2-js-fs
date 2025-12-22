/* ACCORDIONS */
const accordions = document.querySelectorAll(".accordion");

accordions.forEach((btn) => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    content.classList.toggle("active");
  });
});

/* INYECTAR CARDS DINÁMICAS */

const posts = [
  {
    title: "Primer Torneo del Año",
    excerpt:
      "Resumen del primer torneo latinoamericano realizado en Floripa, Brasil",
    img: "assets/img/campeonato.png",
    link: "#",
  },
  {
    title: "Entrenamientos de Verano",
    excerpt:
      "Calendario de las diferentes actividades que realizaremos en diferentes lugares",
    img: "assets/img/training.jpg",
    link: "#",
  },
  {
    title: "Historia del Sumo en Chile",
    excerpt: "Un repaso por los primeros años de la disciplina en el país",
    img: "assets/img/sumito2.png",
    link: "#",
  },
  {
    title: "¿Cómo empezar en el sumo?",
    excerpt: "Guía para nuevos practicantes",
    img: "assets/img/sumomeet.jpg",
    link: "#",
  },
];

const postsGrid = document.getElementById("posts-grid");

posts.forEach((post) => {
  const card = `
        <article class="post-card">
            <div class="post-image">
                <img src="${post.img}" alt="${post.title}">
            </div>
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <a href="${post.link}" class="post-btn">Leer más...</a>
            </div>
        </article>
    `;

  postsGrid.insertAdjacentHTML("beforeend", card);
});
