Atajos:
Ctrl + L
Ctrl + k
Ctrl + c
Ctrl + v
Ctrl + x
Ctrl + y
Ctrl + Alt + flecha
Alt + Tab
Ctrl + Shift + Delete
FN + F2
Alt + F4
Ctrl + s
Ctrl + a
Ctrl + tab
Ctrl + Shift + Tab


Dos ejemplos de mejora sugerida:
-1- JavaScript
    ANTES:
        const contactForm = document.getElementById("taskform");
        if (contactForm) {
        let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    DESPUÉS:
        const contactForm = document.getElementById("taskform");
        if (contactForm) {
            // Intentar leer contactos existentes de forma segura
            let contacts;
            try {
                contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
                if (!Array.isArray(contacts)) contacts = [];
            } catch {
                contacts = [];
            }

-2- CSS
    ANTES:
        /* CONTACT.HTML */

    #contactmain{
        display: flex;
        justify-content: center;
    }
    
    #formsection{
        width: 20%;
    }
    
    #taskform{
        background-color: goldenrod;
    
    }
    
    main section h2{
        color: goldenrod;
    }
    
    #clientdata{
        display: flex;
        flex-direction: column;
        margin: 10%;
    }
    
    #about{
        display: flex;
        flex-direction: column;
        margin: 10%;
    }
    
    #submitid{
        margin: 10%;
    }
    
        DESPUÉS:
            /* CONTACT.HTML */
    #contactmain{
        position: relative;
        min-height: 70vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        overflow: hidden;
    }
    /* Vídeo de fondo específico para la página de contacto */
    #contactmain .hero {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -1;
        opacity: 0.35; /* un poco más suave */
    }
    #formsection{
        width: 100%;
        max-width: 480px;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 16px;
        border: 1px solid rgba(218, 165, 32, 0.6);
        box-shadow: 0 18px 35px rgba(0, 0, 0, 0.65);
        padding: 24px 26px 30px;
        backdrop-filter: blur(5px);
        color: goldenrod;
    }
    #formsection h2{
        margin-bottom: 16px;
        text-align: center;
        font-size: 1.6rem;
        letter-spacing: 0.05em;
    }
    /* Formulario */
    #taskform{
        display: flex;
        flex-direction: column;
        gap: 18px;
    }
    /* Fieldsets */
    #clientdata,
    #about{
        border: 1px solid rgba(218,165,32,0.6);
        border-radius: 10px;
        padding: 14px 16px 10px;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    #clientdata legend,
    #about legend{
        padding: 0 6px;
        font-weight: 600;
        letter-spacing: 0.04em;
    }
    /* Labels y inputs */
    #clientdata label,
    #about label{
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.95rem;
    }
    #clientdata input[type="text"],
    #clientdata input[type="tel"],
    #clientdata input[type="email"]{
        padding: 8px 10px;
        border-radius: 8px;
        border: 1px solid rgba(218,165,32,0.75);
        background-color: rgba(0,0,0,0.85);
        color: goldenrod;
        font-family: var(--main-font);
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    }
    #clientdata input::placeholder{
        color: rgb(255, 206, 91);
        opacity: 0.85;
    }
    #clientdata input:focus{
        border-color: rgb(255, 195, 42);
        box-shadow: 0 0 0 2px rgba(255,195,42,0.4);
        background-color: black;
    }
    /* Checkboxes */
    #about input[type="checkbox"]{
        margin-top: 4px;
        accent-color: goldenrod;
    }
    /* Zona de botones */
    #submitid{
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-top: 4px;
    }
    #submitid input[type="submit"],
    #submitid input[type="reset"]{
        min-width: 110px;
        padding: 8px 14px;
        border-radius: 999px;
        border: 1px solid goldenrod;
        background-color: goldenrod;
        color: black;
        font-family: var(--main-font);
        font-weight: 600;
        cursor: pointer;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        font-size: 0.85rem;
        transition: background-color 0.25s ease, color 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }
    #submitid input[type="submit"]:hover,
    #submitid input[type="reset"]:hover{
        background-color: rgb(255, 195, 42);
        transform: translateY(-2px);
        box-shadow: 0 10px 18px rgba(0,0,0,0.6);
    }
    #submitid input[type="reset"]{
        background-color: transparent;
        color: goldenrod;
    }
    /* Responsive */
    @media (max-width: 768px){
        #formsection{
            max-width: 100%;
            margin: 0 10px;
            padding: 20px 18px 24px;
        }
        #submitid{
            flex-direction: column;
        }
        #submitid input[type="submit"],
        #submitid input[type="reset"]{
            width: 100%;
        }
    }
    
    