/* =========================================================
   MIAUFEST · Cálculo del precio de las entradas
   JavaScript nativo y sencillo (ES5): var, function,
   querySelector/querySelectorAll y bucles for.
   ========================================================= */

/* ---------- 1. DATOS Y ELEMENTOS ---------- */

var GASTOS_POR_ENTRADA = 1.5;   // gastos de gestión por cada entrada
var MAXIMO_POR_TIPO = 10;       // máximo de entradas de cada tipo

var formulario = document.querySelector('#formulario-compra');
var entradas = document.querySelectorAll('.entrada');

var resumenLista = document.querySelector('#resumen-lista');
var totalEntradasTexto = document.querySelector('#total-entradas');
var subtotalTexto = document.querySelector('#subtotal');
var gastosTexto = document.querySelector('#gastos');
var totalTexto = document.querySelector('#total');

var botonComprar = document.querySelector('#boton-comprar');
var mensaje = document.querySelector('#mensaje');
var campoNombre = document.querySelector('#nombre');
var campoEmail = document.querySelector('#email');


/* ---------- 2. FUNCIONES DE AYUDA ---------- */

// Convierte un número en precio con formato español: 12.5 → "12,50 €"
function formatearPrecio(numero) {
    return numero.toFixed(2).replace('.', ',') + ' €';
}

// Lee la cantidad que muestra el contador de una entrada
function leerCantidad(entrada) {
    var cantidad = entrada.querySelector('.contador__cantidad');
    return parseInt(cantidad.textContent, 10);
}

// Escribe una cantidad nueva en el contador de una entrada
function escribirCantidad(entrada, numero) {
    var cantidad = entrada.querySelector('.contador__cantidad');
    cantidad.textContent = numero;
}

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = 'mensaje mensaje--' + tipo;   // "mensaje--error" o "mensaje--ok"
}

function borrarMensaje() {
    mensaje.textContent = '';
    mensaje.className = 'mensaje';
}


/* ---------- 3. CÁLCULO DEL TOTAL ---------- */
// Recorre todas las entradas, calcula subtotales y actualiza el resumen.

function actualizarTotal() {
    var totalEntradas = 0;
    var subtotal = 0;
    var lineasResumen = '';

    for (var i = 0; i < entradas.length; i++) {
        var entrada = entradas[i];

        var precio = parseFloat(entrada.getAttribute('data-precio'));
        var nombre = entrada.getAttribute('data-nombre');
        var cantidad = leerCantidad(entrada);
        var subtotalEntrada = precio * cantidad;

        // Subtotal dentro de la propia tarjeta
        entrada.querySelector('.entrada__subtotal strong').textContent = formatearPrecio(subtotalEntrada);

        // Botones: no bajar de 0 ni pasar del máximo
        entrada.querySelector('.contador__boton--menos').disabled = (cantidad === 0);
        entrada.querySelector('.contador__boton--mas').disabled = (cantidad === MAXIMO_POR_TIPO);

        if (cantidad > 0) {
            entrada.classList.add('is-seleccionada');
            lineasResumen = lineasResumen +
                '<li><span>' + cantidad + ' × ' + nombre + '</span>' +
                '<strong>' + formatearPrecio(subtotalEntrada) + '</strong></li>';
        } else {
            entrada.classList.remove('is-seleccionada');
        }

        totalEntradas = totalEntradas + cantidad;
        subtotal = subtotal + subtotalEntrada;
    }

    var gastos = totalEntradas * GASTOS_POR_ENTRADA;
    var total = subtotal + gastos;

    // Lista del resumen (o el mensaje de "vacío")
    if (lineasResumen === '') {
        resumenLista.innerHTML = '<li class="resumen__vacio">Todavía no has elegido ninguna entrada.</li>';
    } else {
        resumenLista.innerHTML = lineasResumen;
    }

    totalEntradasTexto.textContent = totalEntradas;
    subtotalTexto.textContent = formatearPrecio(subtotal);
    gastosTexto.textContent = formatearPrecio(gastos);
    totalTexto.textContent = formatearPrecio(total);

    // Solo se puede comprar si hay al menos una entrada
    botonComprar.disabled = (totalEntradas === 0);
}


/* ---------- 4. BOTONES + Y − DE CADA ENTRADA ---------- */
// La función recibe UNA entrada y conecta sus dos botones.
// (Así cada botón sabe a qué entrada pertenece.)

function conectarContador(entrada) {
    var botonMenos = entrada.querySelector('.contador__boton--menos');
    var botonMas = entrada.querySelector('.contador__boton--mas');

    botonMas.addEventListener('click', function () {
        var cantidad = leerCantidad(entrada);
        if (cantidad < MAXIMO_POR_TIPO) {
            escribirCantidad(entrada, cantidad + 1);
            borrarMensaje();
            actualizarTotal();
        }
    });

    botonMenos.addEventListener('click', function () {
        var cantidad = leerCantidad(entrada);
        if (cantidad > 0) {
            escribirCantidad(entrada, cantidad - 1);
            borrarMensaje();
            actualizarTotal();
        }
    });
}

for (var i = 0; i < entradas.length; i++) {
    conectarContador(entradas[i]);
}


/* ---------- 5. ENVÍO DEL FORMULARIO ---------- */

// Al escribir en un campo se quita el borde rojo de error
campoNombre.addEventListener('input', function () {
    campoNombre.classList.remove('is-error');
});

campoEmail.addEventListener('input', function () {
    campoEmail.classList.remove('is-error');
});

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();   // no recargar la página

    var nombre = campoNombre.value.trim();
    var email = campoEmail.value.trim();
    var hayErrores = false;

    if (nombre === '') {
        campoNombre.classList.add('is-error');
        hayErrores = true;
    }

    // Comprobación sencilla del email: que tenga @ y un punto
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        campoEmail.classList.add('is-error');
        hayErrores = true;
    }

    if (hayErrores) {
        mostrarMensaje('Revisa tu nombre y tu email antes de comprar.', 'error');
        return;
    }

    // Todo correcto: mensaje de confirmación y formulario a cero
    mostrarMensaje('¡Miau! Compra realizada, ' + nombre + '. Total pagado: ' + totalTexto.textContent + '.', 'ok');

    for (var j = 0; j < entradas.length; j++) {
        escribirCantidad(entradas[j], 0);
    }
    campoNombre.value = '';
    campoEmail.value = '';
    actualizarTotal();
});


/* ---------- 6. ESTADO INICIAL ---------- */
actualizarTotal();