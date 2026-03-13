
// ===============================
// === FORMULARIO CONTACT.HTML ===
// ===============================

const CONTACTS_KEY = "contacts";

function loadContacts() {
    try {
        const parsed = JSON.parse(localStorage.getItem(CONTACTS_KEY) || "[]"); /*Intenta leer de localStorage el valor asociado a CONTACTS_KEY y, si no existe nada, usa "[]" (un array vacío en texto). Luego hace JSON.parse para convertir ese texto en un array u objeto JavaScript. */
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveContacts(contacts) {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts)); //Convierte el array contacts en texto JSON con JSON.stringify y lo guarda en localStorage bajo la clave CONTACTS_KEY. 
}

const contactForm = document.getElementById("taskform");

if (contactForm) {
    const contacts = loadContacts();

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita que recargue la página

        const fname = document.getElementById("fname").value;
        const lname = document.getElementById("lname").value;
        const tel = document.getElementById("tel").value;
        const email = document.getElementById("email").value;

        const sources = Array.from(
            document.querySelectorAll("#about input[type='checkbox']:checked"), //Selecciona todos los checkboxes marcados dentro del contenedor con id about
            (box) => box.value //Array.from(..., (box) => box.value) crea un array nuevo con los value de cada checkbox marcado, y lo asigna a sources.
        );

        const contact = { fname, lname, tel, email, sources }; // Crea el objeto con los datos

        contacts.push(contact); // Añade el nuevo contacto al final de la lista de contactos
        saveContacts(contacts); 

        console.log("Guardado:", contact);
        contactForm.reset(); // Vuelve a poner todos los campos vacíos después de enviar
    });
}



// =============================
// ========= TO‑DO LIST ========
// =============================


const TASKS_KEY = "tasks"; //Clave LocalStorage

function loadTasks() {
    try {
        const parsed = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

let tasks = loadTasks(); // Cargar tareas

// Guardar
function saveTasks() {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// Crear LI
function createTaskItem(texto, index) {
    const li = document.createElement("li");
    // Mantiene las clases antiguas (todo-item/delete-btn) por compatibilidad,
    // pero añade layout Tailwind para que el botón quede a la derecha.
    li.className =
        "todo-item flex items-start gap-3 rounded-md border border-goldenrod bg-goldenrod/20 px-3 py-2 text-goldenrod";
    li.dataset.index = index; // para saber cuál tarea está borrando después (Le asigna un atributo data-index="0" o "1")

    const span = document.createElement("span");
    span.className = "todo-text flex-1 min-w-0 break-words";
    span.textContent = texto;

    const btnDelete = document.createElement("button");
    btnDelete.className =
        "delete-btn shrink-0 ml-auto self-start rounded-md border border-goldenrod bg-black px-2 py-1 text-sm text-goldenrod transition-all duration-200 hover:bg-goldenrod hover:text-black";
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
