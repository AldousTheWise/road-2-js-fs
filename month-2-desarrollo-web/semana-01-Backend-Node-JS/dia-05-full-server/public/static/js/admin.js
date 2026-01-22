function toggleEdit(id) {
  const row = document.getElementById(`row-${id}`);
  if (!row) return;

  // Solo alternamos la clase. El CSS hará el resto.
  row.classList.toggle("is-editing");
  console.log(
    `Toggle edición para: ${id}. Estado: ${row.classList.contains("is-editing")}`,
  );
}
