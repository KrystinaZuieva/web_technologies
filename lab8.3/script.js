document.addEventListener("DOMContentLoaded", () => {
    let draggedTask = null;

    const tasks = document.querySelectorAll(".task");
    const lists = document.querySelectorAll(".task-list");

    tasks.forEach((task) => {
        task.addEventListener("dragstart", handleDragStart);
        task.addEventListener("dragend", handleDragEnd);
    });

    lists.forEach((list) => {
        list.addEventListener("dragover", handleDragOver);
        list.addEventListener("dragenter", handleDragEnter);
        list.addEventListener("dragleave", handleDragLeave);
        list.addEventListener("drop", handleDrop);
    });

    function handleDragStart(e) {
        draggedTask = this;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", this.id);
        setTimeout(() => this.classList.add("dragging"), 0);
    }

    function handleDragEnd() {
        this.classList.remove("dragging");
        draggedTask = null;
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }

    function handleDragEnter() {
        this.setAttribute("aria-dropeffect", "move");
    }

    function handleDragLeave() {
        this.removeAttribute("aria-dropeffect");
    }

    function handleDrop(e) {
        e.preventDefault();
        this.removeAttribute("aria-dropeffect");
        const id = e.dataTransfer.getData("text/plain");
        const task = document.getElementById(id);
        if (task && this !== task.parentNode) {
            this.appendChild(task);
        }
    }
});

