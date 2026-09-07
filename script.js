
/* =========================================================
   BIRTHDAY GIFT SYSTEM
   Form Navigation
   ========================================================= */


document.addEventListener("DOMContentLoaded", () => {


    const preferencias = {
        presupuesto: null,
        categoria: null,
        diversion: null,
        bolucompra: null
    };


    
    let productos = [];




    const limitesPresupuesto = {
        1: 10000,
        2: 15000,
        3: 22000,
        4: 50000
    };

    function recomendar(preferencias, productos) {

        const presupuestoMaximo =
            limitesPresupuesto[preferencias.presupuesto];

        // 1. Filtrar por presupuesto
        let candidatos = productos.filter(producto =>
            producto.precio <= presupuestoMaximo
        );

        // 2. Filtrar por categoría
        if (preferencias.categoria !== "sorpresa") {

            candidatos = candidatos.filter(producto =>
                producto.categoria === preferencias.categoria
            );

        }

        // 3. Calcular coincidencias
        candidatos = candidatos.map(producto => {

            const distanciaDiversion =
                Math.abs(
                    Number(preferencias.diversion) -
                    producto.diversion
                );

            const distanciaBolucompra =
                Math.abs(
                    Number(preferencias.bolucompra) -
                    producto.bolucompra
                );

            const coincidenciaDiversion =
                1 - (distanciaDiversion / 3);

            const coincidenciaBolucompra =
                1 - (distanciaBolucompra / 3);

            const giftScore =
                (
                    coincidenciaDiversion +
                    coincidenciaBolucompra
                ) / 2;

            return {
                ...producto,
                distanciaDiversion,
                distanciaBolucompra,
                coincidenciaDiversion,
                coincidenciaBolucompra,
                giftScore
            };
        });

        // 4. Ordenar por Gift Score y prioridad
        candidatos.sort((a, b) => {

            if (b.giftScore !== a.giftScore) {
                return b.giftScore - a.giftScore;
            }

            return b.prioridad - a.prioridad;
        });

        // 5. Devolver los 3 mejores
        return candidatos.slice(0, 3);
    }







    function mostrarRecomendaciones(recomendaciones) {

        const productCount =
            document.getElementById("product-count");

        productCount.textContent =
            `${productos.length} productos`;


        recomendaciones.forEach((producto, index) => {

            const numero = index + 1;


            // Nombre
            const nombre =
                document.getElementById(
                    `product-name-${numero}`
                );

            nombre.textContent =
                producto.producto;


            // Gift Score
            const giftScore =
                document.getElementById(
                    `gift-score-${numero}`
                );

            giftScore.textContent =
                (
                    producto.giftScore * 100
                ).toFixed(1);


            // Coincidencia diversión
            const funScore =
                document.getElementById(
                    `fun-score-${numero}`
                );

            funScore.textContent =
                (
                    producto.coincidenciaDiversion * 100
                ).toFixed(1) + "%";


            // Coincidencia bolucompra
            const boluScore =
                document.getElementById(
                    `bolu-score-${numero}`
                );

            boluScore.textContent =
                (
                    producto.coincidenciaBolucompra * 100
                ).toFixed(1) + "%";


            // Prioridad
            const priorityScore =
                document.getElementById(
                    `priority-score-${numero}`
                );

            priorityScore.textContent =
                producto.prioridad;

        });
    }











    fetch("productos.csv")
        
        .then(response => response.text())
        .then(data => {

            const filas = data.trim().split(/\r?\n/);

            // Eliminamos la primera fila porque contiene los encabezados
            const datos = filas.slice(1);

            productos = datos.map(fila => {

                const valores = fila.split(",");

                return {
                    id: Number(valores[0]),
                    producto: valores[1],
                    categoria: valores[2],
                    precio: Number(valores[3]),
                    prioridad: Number(valores[4]),
                    diversion: Number(valores[5]),
                    bolucompra: Number(valores[6])
                };
            });

            console.log("Productos cargados:");
            console.table(productos);




        })
        .catch(error => {
            console.error("Error al cargar productos.csv:", error);
        });

        

    /*
     * Todas las pantallas que contienen preguntas
     */
    const questionScreens = document.querySelectorAll(
        ".question_screen"
    );


    questionScreens.forEach((screen) => {

        /*
         * Buscamos los radio buttons de esa pregunta
         */
        const options = screen.querySelectorAll(
            'input[type="radio"]'
        );


        /*
         * Buscamos el botón CONTINUAR
         */
        const continueButton = screen.querySelector(
            ".button"
        );


        /*
         * Si no hay botón, salimos
         */
        if (!continueButton) {
            return;
        }


        /*
         * El botón comienza deshabilitado
         */
        continueButton.disabled = true;

        continueButton.classList.add("disabled");

        continueButton.setAttribute(
            "aria-disabled",
            "true"
        );


        /*
         * Escuchamos cuando el usuario
         * selecciona una opción
         */
        options.forEach((option) => {

            option.addEventListener(
                "change",
                () => {

                    const nombre = option.name;
                    const valor = option.value;

                    preferencias[nombre] = valor;

                    console.log(preferencias);

                    /*
                     * Si hay una opción seleccionada,
                     * habilitamos el botón.
                     */
                    const selected = screen.querySelector(
                        'input[type="radio"]:checked'
                    );


                    if (selected) {

                        continueButton.disabled = false;

                        continueButton.classList.remove(
                            "disabled"
                        );

                        continueButton.setAttribute(
                            "aria-disabled",
                            "false"
                        );

                    }

                }
            );

        });


        /*
         * Controlamos el botón CONTINUAR
         */
        continueButton.addEventListener("click", () => {

    const selected =
        screen.querySelector(
            'input[type="radio"]:checked'
        );

    if (!selected) {
        return;
    }


    const nextScreenId =
        continueButton.dataset.next;


    // ========================================
    // GENERAR RECOMENDACIONES
    // ========================================

    if (nextScreenId === "processing") {

        if (productos.length === 0) {
            console.error(
                "Los productos todavía no fueron cargados."
            );

            return;
        }


        const recomendaciones =
            recomendar(
                preferencias,
                productos
            );


        console.log(
            "Recomendaciones finales:"
        );

        console.table(
            recomendaciones
        );


        mostrarRecomendaciones(
            recomendaciones
        );
    }




    





    // ========================================
    // CAMBIAR DE PANTALLA
    // ========================================

    const nextScreen =
        document.getElementById(
            nextScreenId
        );


    if (nextScreen) {

        nextScreen.scrollIntoView({
            behavior: "smooth"
        });

    }

});

    });

});
