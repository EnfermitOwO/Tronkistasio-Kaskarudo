const pantallaResultado = document.querySelector('#resultado');
const pantallaHistorial = document.querySelector('#historial');
const botones = document.querySelectorAll('.btn');
const btnIgual = document.querySelector('#btnIgual');

const togglePaywall = document.querySelector('#togglePaywall');
const toggleIcono = togglePaywall.querySelector('.toggle-icono');
const modalOverlay = document.querySelector('#modalOverlay');
const cerrarModalBtn = document.querySelector('#cerrarModal');
const maybeLaterBtn = document.querySelector('#maybeLater');
const botonesPlan = document.querySelectorAll('.plan-btn');

let expresion = '';
let paywallActivo = true;

const simbolos = {
    '+': '+',
    '-': '−',
    '*': '×',
    '/': '÷'
};

function actualizarPantalla() {
    pantallaResultado.classList.remove('bloqueado');

    let mostrar = expresion.replace(/[+\-*/]/g, (op) => simbolos[op]);
    pantallaHistorial.textContent = mostrar;

    const partes = expresion.split(/(?<=[\d.])(?=[+\-*/])|(?<=[+\-*/])(?=[\d.])/);
    const ultimo = partes[partes.length - 1];
    pantallaResultado.textContent = ultimo === '' || ultimo === undefined ? '0' : ultimo;
}

function calcular() {
    if (expresion === '') return;

    try {
        // Solo se permiten dígitos, punto y los cuatro operadores básicos.
        if (/[^0-9+\-*/.]/.test(expresion)) {
            throw new Error('Entrada inválida');
        }

        const resultado = Function(`"use strict"; return (${expresion})`)();

        if (!isFinite(resultado)) {
            pantallaResultado.textContent = 'Error';
            pantallaHistorial.textContent = expresion.replace(/[+\-*/]/g, (op) => simbolos[op]);
            pantallaResultado.classList.remove('bloqueado');
            expresion = '';
            return;
        }

        const operacionMostrada = expresion.replace(/[+\-*/]/g, (op) => simbolos[op]) + ' =';
        const valorReal = Number(resultado.toFixed(8)).toString();

        pantallaHistorial.textContent = operacionMostrada;

        if (paywallActivo) {
            // La broma: el resultado se calcula, pero se mantiene oculto
            // hasta que se desactive la "suscripción premium".
            pantallaResultado.textContent = '🔒 Premium';
            pantallaResultado.classList.add('bloqueado');
        } else {
            pantallaResultado.textContent = valorReal;
            pantallaResultado.classList.remove('bloqueado');
        }

        // La operación sigue encadenándose con el valor real internamente,
        // aunque no se muestre en pantalla.
        expresion = resultado.toString();
    } catch (error) {
        pantallaResultado.textContent = 'Error';
        pantallaResultado.classList.remove('bloqueado');
        expresion = '';
    }
}

function abrirModal() {
    modalOverlay.classList.remove('oculto');
}

function cerrarModal() {
    modalOverlay.classList.add('oculto');
}

function manejarIgual() {
    if (paywallActivo) {
        abrirModal();
    } else {
        calcular();
    }
}

function actualizarToggle() {
    togglePaywall.dataset.activo = paywallActivo;
    toggleIcono.textContent = paywallActivo ? '🔒' : '🔓';
    togglePaywall.title = paywallActivo
        ? 'Pantalla premium activada (haz clic para desactivar)'
        : 'Pantalla premium desactivada (haz clic para activar)';
}

botones.forEach((boton) => {
    if (boton === btnIgual) return;

    boton.addEventListener('click', () => {
        const numero = boton.dataset.numero;
        const operador = boton.dataset.operador;
        const accion = boton.dataset.accion;

        if (numero !== undefined) {
            expresion += numero;
            actualizarPantalla();
        } else if (operador !== undefined) {
            if (expresion === '' && operador !== '-') return;

            const ultimoCaracter = expresion.slice(-1);
            if (['+', '-', '*', '/'].includes(ultimoCaracter)) {
                expresion = expresion.slice(0, -1) + operador;
            } else {
                expresion += operador;
            }
            actualizarPantalla();
        } else if (accion === 'limpiar') {
            expresion = '';
            pantallaHistorial.textContent = '';
            pantallaResultado.textContent = '0';
            pantallaResultado.classList.remove('bloqueado');
        } else if (accion === 'borrar') {
            expresion = expresion.slice(0, -1);
            actualizarPantalla();
        }
    });
});

btnIgual.addEventListener('click', manejarIgual);

// Cerrar el modal desde la "x", "Tal vez después" o cualquier botón de plan.
// El cálculo se realiza igual, pero el resultado sigue bloqueado si la
// pantalla premium continúa activada.
[cerrarModalBtn, maybeLaterBtn, ...botonesPlan].forEach((el) => {
    el.addEventListener('click', () => {
        cerrarModal();
        calcular();
    });
});

modalOverlay.addEventListener('click', (evento) => {
    if (evento.target === modalOverlay) {
        cerrarModal();
        calcular();
    }
});

togglePaywall.addEventListener('click', () => {
    paywallActivo = !paywallActivo;
    actualizarToggle();
});

document.addEventListener('keydown', (evento) => {
    if (/[0-9.]/.test(evento.key)) {
        expresion += evento.key;
        actualizarPantalla();
    } else if (['+', '-', '*', '/'].includes(evento.key)) {
        expresion += evento.key;
        actualizarPantalla();
    } else if (evento.key === 'Enter' || evento.key === '=') {
        manejarIgual();
    } else if (evento.key === 'Backspace') {
        expresion = expresion.slice(0, -1);
        actualizarPantalla();
    } else if (evento.key === 'Escape') {
        if (!modalOverlay.classList.contains('oculto')) {
            cerrarModal();
        } else {
            expresion = '';
            pantallaHistorial.textContent = '';
            pantallaResultado.textContent = '0';
            pantallaResultado.classList.remove('bloqueado');
        }
    }
});

actualizarToggle();
