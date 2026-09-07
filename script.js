/* =========================================================
   BIRTHDAY GIFT SYSTEM
   Form Navigation + Recommendation System
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PREFERENCIAS DEL USUARIO
       ===================================================== */

    const preferencias = {
        presupuesto: null,
        categoria: null,
        diversion: null,
        bolucompra: null
    };


    /* =====================================================
       PRODUCTOS
       ===================================================== */

    let productos = [];


    /* =====================================================
       CAMBIAR DE PANTALLA
       ===================================================== */

    function mostrarPantalla(id) {

        const pantallas =
            document.querySelectorAll(".screen");

        pantallas.forEach((pantalla) => {
            pantalla.classList.remove("active");
        });


        const pantallaDestino =
            document.getElementById(id);


        if (!pantallaDestino) {

            console.error(
                `No existe la pantalla: ${id}`
            );

            return;
        }


        pantallaDestino.classList.add("active");
    }


    /* =====================================================
       PANTALLA INICIAL
       ===================================================== */

    mostrarPantalla("home");


    /* =====================================================
       LÍMITES DE PRESUPUESTO
       ===================================================== */

    const limitesPresupuesto = {

        1: 10000,

        2: 15000,

        3: 22000,

        4: 50000

    };


    /* =====================================================
       FUNCIÓN DE RECOMENDACIÓN
       ===================================================== */

    function recomendar(preferencias, productos) {

        /* -------------------------------------------------
           1. OBTENER PRESUPUESTO MÁXIMO
        ------------------------------------------------- */

        const presupuestoMaximo =
            limitesPresupuesto[
                preferencias.presupuesto
            ];


        /* -------------------------------------------------
           2. FILTRAR POR PRESUPUESTO
        ------------------------------------------------- */

        let candidatos =
            productos.filter((producto) =>

                producto.precio <=
                presupuestoMaximo

            );


        console.log(
            "Presupuesto máximo:",
            presupuestoMaximo
        );

        console.table(candidatos);


        /* -------------------------------------------------
           3. FILTRAR POR CATEGORÍA
        ------------------------------------------------- */

        if (
            preferencias.categoria !==
            "sorpresa"
        ) {

            candidatos =
                candidatos.filter(
                    (producto) =>

                        producto.categoria ===
                        preferencias.categoria
                );


            console.log(
                "Categoría seleccionada:",
                preferencias.categoria
            );

            console.table(candidatos);
        }


        /* -------------------------------------------------
           4. CALCULAR COINCIDENCIAS
        ------------------------------------------------- */

        candidatos =
            candidatos.map((producto) => {

                /* -----------------------------------------
                   DISTANCIA DIVERSIÓN
                ----------------------------------------- */

                const distanciaDiversion =
                    Math.abs(

                        Number(
                            preferencias.diversion
                        ) -
                        producto.diversion

                    );


                /* -----------------------------------------
                   DISTANCIA BOLUCOMPRA
                ----------------------------------------- */

                const distanciaBolucompra =
                    Math.abs(

                        Number(
                            preferencias.bolucompra
                        ) -
                        producto.bolucompra

                    );


                /* -----------------------------------------
                   COINCIDENCIA DIVERSIÓN
                ----------------------------------------- */

                const coincidenciaDiversion =
                    1 -
                    (
                        distanciaDiversion / 3
                    );


                /* -----------------------------------------
                   COINCIDENCIA BOLUCOMPRA
                ----------------------------------------- */

                const coincidenciaBolucompra =
                    1 -
                    (
                        distanciaBolucompra / 3
                    );


                /* -----------------------------------------
                   GIFT SCORE
                ----------------------------------------- */

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


        /* -------------------------------------------------
           5. ORDENAR RESULTADOS
        ------------------------------------------------- */

        candidatos.sort((a, b) => {

            /* Primero Gift Score */

            if (
                b.giftScore !==
                a.giftScore
            ) {

                return (
                    b.giftScore -
                    a.giftScore
                );

            }


            /* En caso de empate,
               gana mayor prioridad */

            return (
                b.prioridad -
                a.prioridad
            );

        });


        /* -------------------------------------------------
           6. DEVOLVER SOLO UNA RECOMENDACIÓN
        ------------------------------------------------- */

        return candidatos.slice(0, 1);

    }


    /* =====================================================
       MOSTRAR RECOMENDACIÓN
       ===================================================== */

    function mostrarRecomendaciones(
        recomendaciones
    ) {

        /* -------------------------------------------------
           CANTIDAD TOTAL DE PRODUCTOS
        ------------------------------------------------- */

        const productCount =
            document.getElementById(
                "product-count"
            );


        if (productCount) {

            productCount.textContent =
                `${productos.length} productos`;

        }


        /* -------------------------------------------------
           OCULTAR TODAS LAS TARJETAS
        ------------------------------------------------- */

        for (
            let i = 1;
            i <= 3;
            i++
        ) {

            const tarjeta =
                document.getElementById(
                    `recommendation-${i}`
                );


            if (tarjeta) {

                tarjeta.style.display =
                    "none";

            }

        }


        /* -------------------------------------------------
           VERIFICAR SI EXISTE UNA RECOMENDACIÓN
        ------------------------------------------------- */

        if (
            !recomendaciones ||
            recomendaciones.length === 0
        ) {

            console.warn(
                "No se encontró ningún producto compatible."
            );

            return;

        }


        /* -------------------------------------------------
           OBTENER ÚNICA RECOMENDACIÓN
        ------------------------------------------------- */

        const producto =
            recomendaciones[0];


        console.log(
            "Producto recomendado:",
            producto
        );


        /* -------------------------------------------------
           MOSTRAR PRIMERA TARJETA
        ------------------------------------------------- */

        const tarjeta =
            document.getElementById(
                "recommendation-1"
            );


        if (!tarjeta) {

            console.error(
                "No existe la tarjeta recommendation-1"
            );

            return;

        }


        tarjeta.style.display = "";


        /* -------------------------------------------------
           IMAGEN DEL PRODUCTO
        ------------------------------------------------- */

        const imagen =
            document.getElementById(
                "product-image-1"
            );


        if (imagen) {

            imagen.src =
                producto.img;

            imagen.alt =
                producto.producto;

        }


        /* -------------------------------------------------
           NOMBRE
        ------------------------------------------------- */

        const nombre =
            document.getElementById(
                "product-name-1"
            );


        if (nombre) {

            nombre.textContent =
                producto.producto;

        }


        /* -------------------------------------------------
           GIFT SCORE
        ------------------------------------------------- */

        const giftScore =
            document.getElementById(
                "gift-score-1"
            );


        if (giftScore) {

            giftScore.textContent =
                (
                    producto.giftScore *
                    100
                ).toFixed(1);

        }


        /* -------------------------------------------------
           COINCIDENCIA DIVERSIÓN
        ------------------------------------------------- */

        const funScore =
            document.getElementById(
                "fun-score-1"
            );


        if (funScore) {

            funScore.textContent =
                (
                    producto
                        .coincidenciaDiversion *
                    100
                ).toFixed(1) + "%";

        }


        /* -------------------------------------------------
           COINCIDENCIA BOLUCOMPRA
        ------------------------------------------------- */

        const boluScore =
            document.getElementById(
                "bolu-score-1"
            );


        if (boluScore) {

            boluScore.textContent =
                (
                    producto
                        .coincidenciaBolucompra *
                    100
                ).toFixed(1) + "%";

        }


        /* -------------------------------------------------
           PRIORIDAD
        ------------------------------------------------- */

        const priorityScore =
            document.getElementById(
                "priority-score-1"
            );


        if (priorityScore) {

            priorityScore.textContent =
                producto.prioridad;

        }


        /* -------------------------------------------------
           PRECIO
        ------------------------------------------------- */

        const price =
            document.getElementById(
                "product-price-1"
            );


        if (price) {

            price.textContent =
                `$${producto.precio.toLocaleString(
                    "es-AR"
                )}`;

        }

    }


    /* =====================================================
       CARGAR PRODUCTOS DESDE CSV
       ===================================================== */

    fetch("productos.csv")

        .then((response) => {

            if (!response.ok) {

                throw new Error(
                    "No se pudo cargar productos.csv"
                );

            }

            return response.text();

        })


        .then((data) => {

            /* ---------------------------------------------
               SEPARAR FILAS
            --------------------------------------------- */

            const filas =
                data
                    .trim()
                    .split(/\r?\n/);


            /* ---------------------------------------------
               ELIMINAR ENCABEZADO
            --------------------------------------------- */

            const datos =
                filas.slice(1);


            /* ---------------------------------------------
               CONVERTIR CSV A OBJETOS
            --------------------------------------------- */

            productos =
                datos.map((fila) => {

                    const valores =
                        fila.split(",");


                    return {

                        id:
                            Number(
                                valores[0]
                            ),

                        producto:
                            valores[1],

                        categoria:
                            valores[2],

                        precio:
                            Number(
                                valores[3]
                            ),

                        prioridad:
                            Number(
                                valores[4]
                            ),

                        diversion:
                            Number(
                                valores[5]
                            ),

                        bolucompra:
                            Number(
                                valores[6]
                            ),

                        /* NUEVO CAMPO */

                        img:
                            valores[7]

                    };

                });


            /* ---------------------------------------------
               VERIFICAR PRODUCTOS
            --------------------------------------------- */

            console.log(
                "Productos cargados:"
            );

            console.table(productos);


            console.log(
                "Cantidad de productos:",
                productos.length
            );

        })


        .catch((error) => {

            console.error(
                "Error al cargar productos.csv:",
                error
            );

        });


    /* =====================================================
       PANTALLAS DE PREGUNTAS
       ===================================================== */

    const questionScreens =
        document.querySelectorAll(
            ".question_screen"
        );


    questionScreens.forEach(
        (screen) => {

            /* ---------------------------------------------
               RADIO BUTTONS
            --------------------------------------------- */

            const options =
                screen.querySelectorAll(
                    'input[type="radio"]'
                );


            /* ---------------------------------------------
               BOTÓN CONTINUAR
            --------------------------------------------- */

            const continueButton =
                screen.querySelector(
                    ".button"
                );


            /* ---------------------------------------------
               SI NO EXISTE BOTÓN
            --------------------------------------------- */

            if (!continueButton) {
                return;
            }


            /* ---------------------------------------------
               BOTÓN DESHABILITADO AL INICIO
            --------------------------------------------- */

            continueButton.disabled =
                true;


            continueButton.classList.add(
                "disabled"
            );


            continueButton.setAttribute(
                "aria-disabled",
                "true"
            );


            /* ---------------------------------------------
               ESCUCHAR SELECCIÓN
            --------------------------------------------- */

            options.forEach(
                (option) => {

                    option.addEventListener(
                        "change",
                        () => {

                            const nombre =
                                option.name;


                            const valor =
                                option.value;


                            /* Guardar preferencia */

                            preferencias[nombre] =
                                valor;


                            console.log(
                                "Preferencias:",
                                preferencias
                            );


                            /* ---------------------------------
                               COMPROBAR SELECCIÓN
                            --------------------------------- */

                            const selected =
                                screen.querySelector(
                                    'input[type="radio"]:checked'
                                );


                            if (selected) {

                                continueButton.disabled =
                                    false;


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

                }
            );


            /* ---------------------------------------------
               BOTÓN CONTINUAR
            --------------------------------------------- */

            continueButton.addEventListener(
                "click",
                () => {

                    /* -----------------------------------------
                       VERIFICAR SELECCIÓN
                    ----------------------------------------- */

                    const selected =
                        screen.querySelector(
                            'input[type="radio"]:checked'
                        );


                    if (!selected) {

                        return;

                    }


                    /* -----------------------------------------
                       SIGUIENTE PANTALLA
                    ----------------------------------------- */

                    const nextScreenId =
                        continueButton.dataset.next;


                    /* =========================================
                       GENERAR RECOMENDACIÓN
                    ========================================= */

                    if (
                        nextScreenId ===
                        "processing"
                    ) {

                        /* -------------------------------------
                           VERIFICAR PRODUCTOS
                        ------------------------------------- */

                        if (
                            productos.length === 0
                        ) {

                            console.error(
                                "Los productos todavía no fueron cargados."
                            );

                            return;

                        }


                        /* -------------------------------------
                           CALCULAR RECOMENDACIÓN
                        ------------------------------------- */

                        const recomendaciones =
                            recomendar(
                                preferencias,
                                productos
                            );


                        console.log(
                            "Recomendación final:"
                        );


                        console.table(
                            recomendaciones
                        );


                        console.log(
                            "Cantidad de recomendaciones:",
                            recomendaciones.length
                        );


                        /* -------------------------------------
                           MOSTRAR RECOMENDACIÓN
                        ------------------------------------- */

                        mostrarRecomendaciones(
                            recomendaciones
                        );


                        /* -------------------------------------
                           MOSTRAR PROCESSING
                        ------------------------------------- */

                        mostrarPantalla(
                            "processing"
                        );


                        /* -------------------------------------
                           SIMULAR PROCESAMIENTO
                           
                           2 segundos
                        ------------------------------------- */

                        setTimeout(
                            () => {

                                mostrarPantalla(
                                    "results"
                                );

                            },
                            2000
                        );


                        /*
                         * IMPORTANTE:
                         *
                         * Evitamos que el código continúe
                         * y vuelva a ejecutar:
                         *
                         * mostrarPantalla(nextScreenId)
                         */

                        return;

                    }


                    /* =========================================
                       CAMBIAR DE PANTALLA NORMALMENTE
                    ========================================= */

                    mostrarPantalla(
                        nextScreenId
                    );

                }
            );

        }
    );


    /* =====================================================
       BOTONES DE NAVEGACIÓN
       
       Pantallas que NO son preguntas
       ===================================================== */

    const navigationButtons =
        document.querySelectorAll(
            ".screen:not(.question_screen) [data-next]"
        );


    navigationButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const nextScreenId =
                        button.dataset.next;


                    mostrarPantalla(
                        nextScreenId
                    );

                }
            );

        }
    );

});