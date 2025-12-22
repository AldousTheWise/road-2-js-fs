/* =====================================
    
    modal.js
    Componente del modal de una
    nueva tarea
   ===================================== */

export function ModalComponent() {
  return /*html*/ `
        <dialog id="task-modal" class="modal">
            <div class="modal__content">
                <header class="modal__header">
                    <h2 id="modal-title">Nueva Tarea</h2>
                    <button class="modal__close" id="modal-close" aria-label="Cerrar modal">&times;</button>
                </header>

                <form action="" class="modal__form" id="task-form">
                    <div class="campo-formulario">
                        <label for="task-title">Título<span class="required">*</span></label>
                        <input type="text" id="task-title" name="title" required>
                    </div>

                    <div class="campo-formulario">
                        <label for="task-desc">Descripción</label>
                        <textarea name="description" id="task-desc"></textarea>
                    </div>

                    <div class="campo-formulario">
                        <label for="task-priority">Prioridad</label>
                        <select name="priority" id="task-priority">
                            <option value="baja">Baja</option>
                            <option value="media" selected>Media</option>
                            <option value="alta">Alta</option>
                        </select>
                    </div>

                    <div class="modal__actions">
                        <button type="button" class="btn btn--secondary" id="modal-cancel">Cancelar</button>
                        <button type="submit" class="btn btn--primary">Agregar</button>
                    </div>
                </form>
            </div>
        </dialog>
    `;
}
