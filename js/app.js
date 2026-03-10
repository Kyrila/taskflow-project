
// ===============================
// === FORMULARIO CONTACT.HTML ===
// ===============================

const contactForm = document.getElementById("taskform");

if (contactForm) {
    let contacts = JSON.parse(localStorage.getItem("contacts")) || []; // JSON.parse(...) → convierte el texto a un array + || [] → si no hay nada guardado, usa un array vacío

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Evita que recargue la página

        const fname = document.getElementById("fname").value;
        const lname = document.getElementById("lname").value;
        const tel = document.getElementById("tel").value;
        const email = document.getElementById("email").value;
    
        // Obtener los checkboxes marcados
        const sources = [];
        document
            .querySelectorAll("#about input[type='checkbox']:checked") // Busca todos los checkbox marcados dentro de #about + Recorre cada uno
            .forEach((box) => sources.push(box.value)); // Extrae su .value + Los mete dentro del array sources

        const contact = { fname, lname, tel, email, sources }; // Crea el objeto con los datos

        contacts.push(contact); // Añade el nuevo contacto al final de la lista de contactos
        localStorage.setItem("contacts", JSON.stringify(contacts)); // JSON.stringify() → convierte el array en texto + localStorage → lo almacena de forma permanente

        console.log("Guardado:", contact);
        contactForm.reset(); // Vuelve a poner todos los campos vacíos después de enviar
    });
}



// =============================
// ========= TO‑DO LIST ========
// =============================


const TASKS_KEY = "tasks"; //Clave LocalStorage


let tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || []; // Cargar tareas

// Guardar
function saveTasks() {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// Crear LI
function createTaskItem(texto, index) {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.index = index; // para saber cuál tarea está borrando después (Le asigna un atributo data-index="0" o "1")

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = texto;

    const btnDelete = document.createElement("button");
    btnDelete.className = "delete-btn";
    btnDelete.type = "button";
    btnDelete.textContent = "Eliminar";

    li.appendChild(span);
    li.appendChild(btnDelete);

    return li;
}

// Pintar tareas guardadas
function loadTasks() {
    const list = document.getElementById("todo-list");
    if (!list) return;

    list.innerHTML = ""; // Vacía el contenido antes de llenarlo de nuevo

    tasks.forEach((texto, index) => {
        list.appendChild(createTaskItem(texto, index));
    });
}



// ======================================================
// ===== SE ACTIVA SOLO SI EXISTE EL WIDGET TO‑DO =======
// ======================================================

//se ejecuta cuando todo el HTML ya está cargado
document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.getElementById("task-form");
    const input = document.getElementById("new-task");
    const list = document.getElementById("todo-list");

    // Si no existe el widget → salir del script (no rompe otras páginas)
    if (!todoForm || !input || !list) return;

    // Cargar tareas guardadas al abrir la página
    loadTasks();

    // Añadir tarea
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const texto = input.value.trim(); // Evita tareas vacías + Elimina espacios al inicio y final
        if (!texto) {
            input.value = "";
            return;
        }

        tasks.push(texto); // Añade la nueva tarea al array
        saveTasks();
        loadTasks();

        input.value = ""; // Limpia la caja
        input.focus();  // Vuelve a darle el foco para escribir rápidamente
    });

    // Eliminar tarea
    list.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {  // Asegura que el clic fue en un botón de borrar
            const li = e.target.closest("li");
            const index = li.dataset.index;

            tasks.splice(index, 1);
            saveTasks();
            loadTasks();
        }
    });
});
