
// Seleccionar el formulario
const form = document.getElementById("taskform");

// Cargar datos guardados
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

// Evento submit
form.addEventListener("submit", function(e) {

    e.preventDefault(); // evitar recargar la página

    // Capturar valores
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const tel = document.getElementById("tel").value;
    const email = document.getElementById("email").value;

    // Capturar checkboxes
    const sources = [];

    document.querySelectorAll("#about input[type='checkbox']:checked")
    .forEach(box => {
        sources.push(box.value);
    });

    // Crear objeto con datos
    const contact = {
        fname,
        lname,
        tel,
        email,
        sources
    };

    // Guardar en array
    contacts.push(contact);

    // Guardar en LocalStorage
    localStorage.setItem("contacts", JSON.stringify(contacts)); // El método JSON.stringify() convierte un objeto o valor de JavaScript en una cadena de texto JSON, opcionalmente reemplaza valores si se indica una función de reemplazo, o si se especifican las propiedades mediante un array de reemplazo.

    console.log("Guardado:", contact);

    // Limpiar formulario
    form.reset();
});

// Mostrar en consola al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    const saved = JSON.parse(localStorage.getItem("contacts")) || []; // El método JSON.parse() analiza una cadena de texto como JSON, transformando opcionalmente el valor producido por el análisis.
    console.log("Contactos guardados:", saved);
});