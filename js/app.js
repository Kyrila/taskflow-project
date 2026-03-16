
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

// Cargar tareas desde localStorage, soportando tanto el formato antiguo (string)
// como el nuevo formato { text, level }.
function loadTasksFromStorage() {
    try {
        const parsed = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
        if (!Array.isArray(parsed)) return [];

        return parsed
            .map((item) => {
                if (typeof item === "string") {
                    return { text: item, level: "medio" };
                }

                if (item && typeof item.text === "string") {
                    return {
                        text: item.text,
                        level: item.level || "medio",
                    };
                }

                return null;
            })
            .filter(Boolean);
    } catch {
        return [];
    }
}

let tasks = loadTasksFromStorage(); // Cargar tareas

// Guardar
function saveTasks() {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// Crear LI
function createTaskItem(task, index) {
    const li = document.createElement("li");
    // Mantiene las clases antiguas (todo-item/delete-btn) por compatibilidad,
    // pero añade layout Tailwind para que el botón quede a la derecha.
    li.className =
        "todo-item flex items-start gap-3 rounded-md border border-goldenrod bg-goldenrod/20 px-3 py-2 text-goldenrod";
    li.dataset.index = index; // para saber cuál tarea está borrando después (Le asigna un atributo data-index="0" o "1")
    li.dataset.level = task.level; // nivel de la tarea (facil/medio/dificil)

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "flex-1 min-w-0";

    const span = document.createElement("span");
    span.className = "todo-text block break-words";
    span.textContent = task.text;

    const badge = document.createElement("span");
    badge.className =
        "mt-1 inline-flex items-center rounded-full border border-goldenrod/60 bg-black/40 px-2 py-0.5 text-xs uppercase tracking-wide";

    let badgeText = "Medio";
    if (task.level === "facil") badgeText = "Fácil";
    if (task.level === "dificil") badgeText = "Difícil";

    badge.textContent = `Nivel: ${badgeText}`;

    contentWrapper.appendChild(span);
    contentWrapper.appendChild(badge);

    const btnDelete = document.createElement("button");
    btnDelete.className =
        "delete-btn shrink-0 ml-auto self-start rounded-md border border-goldenrod bg-black px-2 py-1 text-sm text-goldenrod transition-all duration-200 hover:bg-goldenrod hover:text-black";
    btnDelete.type = "button";
    btnDelete.textContent = "Eliminar";

    li.appendChild(contentWrapper);
    li.appendChild(btnDelete);

    return li;
}

// ======================================================
// ===== SE ACTIVA SOLO SI EXISTE EL WIDGET TO‑DO =======
// ======================================================

//se ejecuta cuando todo el HTML ya está cargado
document.addEventListener("DOMContentLoaded", () => {
    // Desktop
    const todoForm = document.getElementById("task-form");
    const input = document.getElementById("new-task");
    const list = document.getElementById("todo-list");
    const levelSelect = document.getElementById("task-level"); // select para nivel de tarea
    const filterSelect = document.getElementById("task-filter"); // select para filtrar tareas

    // Mobile
    const todoFormMobile = document.getElementById("task-form-mobile");
    const inputMobile = document.getElementById("new-task-mobile");
    const listMobile = document.getElementById("todo-list-mobile");
    const levelSelectMobile = document.getElementById("task-level-mobile");
    const filterSelectMobile = document.getElementById("task-filter-mobile");

    // Si no existe ningún widget → salir del script (no rompe otras páginas)
    if (!todoForm && !todoFormMobile) return;

    // Función para pintar tareas con filtro por nivel en una lista dada
    function renderTasksForList(targetList, filterLevel = "all") {
        if (!targetList) return;

        targetList.innerHTML = ""; // Vacía el contenido antes de llenarlo de nuevo

        tasks.forEach((task, index) => {
            if (filterLevel === "all" || task.level === filterLevel) {
                targetList.appendChild(createTaskItem(task, index));
            }
        });
    }

    // Pintar listas iniciales
    renderTasksForList(list, "all");
    renderTasksForList(listMobile, "all");

    // Cambiar filtro de tareas (tres niveles seleccionables) desktop
    if (filterSelect) {
        filterSelect.addEventListener("change", () => {
            const value = filterSelect.value || "all"; // valores esperados: all, facil, medio, dificil
            renderTasksForList(list, value);
        });
    }

    // Cambiar filtro de tareas (tres niveles seleccionables) móvil
    if (filterSelectMobile) {
        filterSelectMobile.addEventListener("change", () => {
            const value = filterSelectMobile.value || "all";
            renderTasksForList(listMobile, value);
        });
    }

    // Añadir tarea en desktop
    if (todoForm && input && list) {
        todoForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const texto = input.value.trim(); // Evita tareas vacías + Elimina espacios al inicio y final
            if (!texto) {
                input.value = "";
                return;
            }

            const selectedLevel =
                (levelSelect && levelSelect.value) || "medio"; // facil / medio / dificil

            tasks.push({
                text: texto,
                level: selectedLevel,
            }); // Añade la nueva tarea al array
            saveTasks();

            const activeFilter =
                (filterSelect && filterSelect.value) || "all";
            renderTasksForList(list, activeFilter);
            renderTasksForList(listMobile, activeFilter);

            input.value = ""; // Limpia la caja
            input.focus();  // Vuelve a darle el foco para escribir rápidamente
        });
    }

    // Añadir tarea en móvil
    if (todoFormMobile && inputMobile && listMobile) {
        todoFormMobile.addEventListener("submit", (e) => {
            e.preventDefault();

            const texto = inputMobile.value.trim();
            if (!texto) {
                inputMobile.value = "";
                return;
            }

            const selectedLevelMobile =
                (levelSelectMobile && levelSelectMobile.value) || "medio";

            tasks.push({
                text: texto,
                level: selectedLevelMobile,
            });
            saveTasks();

            const activeFilterMobile =
                (filterSelectMobile && filterSelectMobile.value) || "all";
            renderTasksForList(listMobile, activeFilterMobile);
            renderTasksForList(list, activeFilterMobile);

            inputMobile.value = "";
            inputMobile.focus();
        });
    }

    // Eliminar tarea (delegado) para ambas listas
    function setupDeleteListener(targetList) {
        if (!targetList) return;

        targetList.addEventListener("click", (e) => {
            if (e.target.classList.contains("delete-btn")) {  // Asegura que el clic fue en un botón de borrar
                const li = e.target.closest("li");
                const index = li.dataset.index;

                tasks.splice(index, 1);
                saveTasks();

                const currentFilterDesktop =
                    (filterSelect && filterSelect.value) || "all";
                const currentFilterMobile =
                    (filterSelectMobile && filterSelectMobile.value) || "all";

                renderTasksForList(list, currentFilterDesktop);
                renderTasksForList(listMobile, currentFilterMobile);
            }
        });
    }

    setupDeleteListener(list);
    setupDeleteListener(listMobile);
});
