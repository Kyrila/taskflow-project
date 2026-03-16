
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
// como el nuevo formato { id, text, level, dueDate }.
function loadTasksFromStorage() {
    try {
        const parsed = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
        if (!Array.isArray(parsed)) return [];

        return parsed
            .map((item) => {
                const baseId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

                // Formato antiguo: solo string
                if (typeof item === "string") {
                    return {
                        id: baseId,
                        text: item,
                        level: "medio",
                        dueDate: null,
                    };
                }

                // Formato objeto
                if (item && typeof item.text === "string") {
                    return {
                        id: item.id || baseId,
                        text: item.text,
                        level: item.level || "medio",
                        dueDate: item.dueDate || null,
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

// Comparador por fecha límite (tareas más urgentes primero)
function compareByDueDate(a, b) {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1; // a sin fecha, va después
    if (!b.dueDate) return -1; // b sin fecha, va después

    const da = new Date(a.dueDate);
    const db = new Date(b.dueDate);
    if (isNaN(da) || isNaN(db)) return 0;
    return da - db; // más antigua (más urgente) primero
}

// Formatea una fecha (YYYY-MM-DD) a DD-MM-YY para mostrar
function formatDateForDisplay(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    if (!year || !month || !day) return dateStr;
    const shortYear = year.slice(-2);
    return `${day}-${month}-${shortYear}`;
}

// Crear LI
function createTaskItem(task) {
    const li = document.createElement("li");
    // Mantiene las clases antiguas (todo-item/delete-btn) por compatibilidad,
    // pero añade layout Tailwind para que el botón quede a la derecha.
    li.className =
        "todo-item flex items-start gap-3 rounded-md border border-goldenrod bg-goldenrod/20 px-3 py-2 text-goldenrod";
    li.dataset.id = task.id; // identificador único de la tarea
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

    // Información de fecha límite y recordatorio corto
    if (task.dueDate) {
        const dueBadge = document.createElement("span");

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(task.dueDate);
        if (!isNaN(due)) {
            due.setHours(0, 0, 0, 0);
            const diffMs = due.getTime() - today.getTime();
            const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

            let label = "";
            let colorClasses =
                "border-goldenrod/60 bg-black/40 text-goldenrod";

            if (diffDays < 0) {
                label = "Vencida";
                colorClasses =
                    "border-red-500/70 bg-red-900/40 text-red-300";
            } else if (diffDays === 0) {
                label = "Hoy";
                colorClasses =
                    "border-yellow-400/70 bg-yellow-900/40 text-yellow-200";
            } else if (diffDays === 1) {
                label = "Mañana";
                colorClasses =
                    "border-yellow-400/70 bg-yellow-900/40 text-yellow-200";
            } else if (diffDays <= 3) {
                label = `En ${diffDays} días`;
                colorClasses =
                    "border-yellow-400/70 bg-yellow-900/40 text-yellow-200";
            } else {
                label = `Para ${formatDateForDisplay(task.dueDate)}`;
            }

            dueBadge.className = `mt-1 ml-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs uppercase tracking-wide ${colorClasses}`;
            dueBadge.textContent = label;
        } else {
            dueBadge.className =
                "mt-1 ml-1 inline-flex items-center rounded-full border border-goldenrod/60 bg-black/40 px-2 py-0.5 text-xs uppercase tracking-wide";
            dueBadge.textContent = `Fecha: ${formatDateForDisplay(
                task.dueDate
            )}`;
        }

        contentWrapper.appendChild(dueBadge);
    }

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

// =============================
// ========= THEME =============
// =============================

const THEME_KEY = "app-theme";

function applyTheme(theme) {
    const body = document.body;
    const toggleBtn = document.getElementById("theme-toggle");

    if (theme === "light") {
        body.classList.remove("bg-black", "text-goldenrod", "theme-dark");
        body.classList.add("bg-white", "text-black", "theme-light");
        if (toggleBtn) toggleBtn.textContent = "Dark theme";
    } else {
        body.classList.remove("bg-white", "text-black", "theme-light");
        body.classList.add("bg-black", "text-goldenrod", "theme-dark");
        if (toggleBtn) toggleBtn.textContent = "Light theme";
    }

    localStorage.setItem(THEME_KEY, theme);
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
    applyTheme(savedTheme);

    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const current = localStorage.getItem(THEME_KEY) || "dark";
            const next = current === "dark" ? "light" : "dark";
            applyTheme(next);
        });
    }
});

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
    const dateInput = document.getElementById("task-date"); // fecha límite

    // Mobile
    const todoFormMobile = document.getElementById("task-form-mobile");
    const inputMobile = document.getElementById("new-task-mobile");
    const listMobile = document.getElementById("todo-list-mobile");
    const levelSelectMobile = document.getElementById("task-level-mobile");
    const filterSelectMobile = document.getElementById("task-filter-mobile");
    const dateInputMobile = document.getElementById("task-date-mobile");

    // Si no existe ningún widget → salir del script (no rompe otras páginas)
    if (!todoForm && !todoFormMobile) return;

    // Función para pintar tareas con filtro por nivel en una lista dada
    function renderTasksForList(targetList, filterLevel = "all") {
        if (!targetList) return;

        targetList.innerHTML = ""; // Vacía el contenido antes de llenarlo de nuevo

        const filtered = tasks.filter(
            (task) => filterLevel === "all" || task.level === filterLevel
        );

        const sorted = filtered.slice().sort(compareByDueDate);

        sorted.forEach((task) => {
            targetList.appendChild(createTaskItem(task));
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

            const dueDateValue = dateInput ? dateInput.value : "";
            const selectedLevel =
                (levelSelect && levelSelect.value) || "medio"; // facil / medio / dificil

            tasks.push({
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                text: texto,
                level: selectedLevel,
                dueDate: dueDateValue || null,
            }); // Añade la nueva tarea al array
            saveTasks();

            const activeFilter =
                (filterSelect && filterSelect.value) || "all";
            renderTasksForList(list, activeFilter);
            renderTasksForList(listMobile, activeFilter);

            input.value = ""; // Limpia la caja
            input.focus();  // Vuelve a darle el foco para escribir rápidamente
            if (dateInput) dateInput.value = "";
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

            const dueDateValueMobile = dateInputMobile
                ? dateInputMobile.value
                : "";
            const selectedLevelMobile =
                (levelSelectMobile && levelSelectMobile.value) || "medio";

            tasks.push({
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                text: texto,
                level: selectedLevelMobile,
                dueDate: dueDateValueMobile || null,
            });
            saveTasks();

            const activeFilterMobile =
                (filterSelectMobile && filterSelectMobile.value) || "all";
            renderTasksForList(listMobile, activeFilterMobile);
            renderTasksForList(list, activeFilterMobile);

            inputMobile.value = "";
            inputMobile.focus();
            if (dateInputMobile) dateInputMobile.value = "";
        });
    }

    // Eliminar tarea (delegado) para ambas listas
    function setupDeleteListener(targetList) {
        if (!targetList) return;

        targetList.addEventListener("click", (e) => {
            if (e.target.classList.contains("delete-btn")) {  // Asegura que el clic fue en un botón de borrar
                const li = e.target.closest("li");
                const id = li.dataset.id;

                const index = tasks.findIndex((task) => task.id === id);
                if (index !== -1) {
                    tasks.splice(index, 1);
                }
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

// =============================
// ======== PLAYLIST ==========
// =============================

const PLAYLIST_KEY = "playlist";

function loadPlaylist() {
    try {
        const parsed = JSON.parse(localStorage.getItem(PLAYLIST_KEY) || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function savePlaylist(playlist) {
    localStorage.setItem(PLAYLIST_KEY, JSON.stringify(playlist));
}

function createSongItem(song) {
    const li = document.createElement("li");
    li.className =
        "song-item flex items-start gap-3 rounded-md border border-goldenrod bg-black/40 px-3 py-2 text-goldenrod";
    li.dataset.id = song.id;
    li.dataset.genre = song.genre;

    const content = document.createElement("div");
    content.className = "flex-1 min-w-0";

    const title = document.createElement("p");
    title.className = "font-semibold break-words";
    title.textContent = song.title || "Sin título";

    const artist = document.createElement("p");
    artist.className = "text-sm opacity-80 break-words";
    artist.textContent = song.artist || "Artista desconocido";

    const meta = document.createElement("div");
    meta.className = "mt-1 flex flex-wrap items-center gap-2 text-xs";

    const genreBadge = document.createElement("span");
    genreBadge.className =
        "inline-flex items-center rounded-full border border-goldenrod/60 bg-black/40 px-2 py-0.5 uppercase tracking-wide";

    const genreLabelMap = {
        "rap": "RAP",
        "rock": "ROCK",
        "hip-hop": "HIP-HOP",
        "classical": "CLASSICAL",
        "blues": "BLUES",
        "electro": "ELECTRO",
        "pop": "POP",
        "rnb": "R&B",
        "soul": "SOUL",
        "indie": "INDIE",
        "flamenco": "FLAMENCO",
        "jazz": "JAZZ",
    };
    genreBadge.textContent = genreLabelMap[song.genre] || song.genre || "GENRE";

    if (song.url) {
        const link = document.createElement("a");
        link.href = song.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className =
            "underline decoration-goldenrod/60 hover:decoration-yellow-300";
        link.textContent = "Play";
        meta.appendChild(link);
    }

    meta.appendChild(genreBadge);

    content.appendChild(title);
    content.appendChild(artist);
    content.appendChild(meta);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className =
        "playlist-delete-btn shrink-0 ml-auto self-start rounded-md border border-goldenrod bg-black px-2 py-1 text-xs text-goldenrod transition-all duration-200 hover:bg-goldenrod hover:text-black";
    deleteBtn.textContent = "Eliminar";

    li.appendChild(content);
    li.appendChild(deleteBtn);

    return li;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("playlist-form");
    const list = document.getElementById("playlist-list");
    const filterSelect = document.getElementById("playlist-filter");

    if (!form || !list || !filterSelect) return;

    let playlist = loadPlaylist();

    function renderPlaylist(filterGenre = "all") {
        list.innerHTML = "";

        playlist
            .filter(
                (song) => filterGenre === "all" || song.genre === filterGenre
            )
            .forEach((song) => {
                list.appendChild(createSongItem(song));
            });
    }

    renderPlaylist();

    filterSelect.addEventListener("change", () => {
        const value = filterSelect.value || "all";
        renderPlaylist(value);
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const titleInput = document.getElementById("song-title");
        const artistInput = document.getElementById("song-artist");
        const genreSelect = document.getElementById("song-genre");
        const urlInput = document.getElementById("song-url");

        const title = titleInput.value.trim();
        const artist = artistInput.value.trim();
        const genre = genreSelect.value;
        const url = urlInput.value.trim();

        if (!title && !artist) {
            return;
        }

        const newSong = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            title,
            artist,
            genre,
            url: url || "",
        };

        playlist.push(newSong);
        savePlaylist(playlist);

        const activeFilter = filterSelect.value || "all";
        renderPlaylist(activeFilter);

        titleInput.value = "";
        artistInput.value = "";
        urlInput.value = "";
        titleInput.focus();
    });

    list.addEventListener("click", (e) => {
        if (e.target.classList.contains("playlist-delete-btn")) {
            const li = e.target.closest("li");
            const id = li.dataset.id;

            playlist = playlist.filter((song) => song.id !== id);
            savePlaylist(playlist);

            const activeFilter = filterSelect.value || "all";
            renderPlaylist(activeFilter);
        }
    });
});
