/**
 * open modal
 * @param {HTMLDialogElement} modal
 */
export function openModal(modal) {
    modal.showModal();

    const btnCloseModal = modal.querySelector(".btnCloseModal");
    btnCloseModal?.addEventListener("click", () => {
        closeModal(modal);
    });
}


/**
 * close modal
 * @param {HTMLDialogElement} modal
 */
export function closeModal(modal) {
    modal.classList.add("closing");
    modal.addEventListener("animationend", () => {
        const isClosing = modal.classList.contains("closing");

        if (isClosing) {
            modal.classList.remove("closing");
            modal.close();
        }
    }, { once: true });
}