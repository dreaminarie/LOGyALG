import {
    registrarNuevoViaje,
    eliminarViajeUI,
    mostrarDestinosDisponibles,
    mostrarTransportesDisponibles
} from './interfaz-usuario.js';

import {
    mostrarItinerario,
    getDestinosDisponibles,
    getTransportesDisponibles,
    destinos
} from './gestor-viajes.js';

const llenarOpciones = () => {
    const destinos = getDestinosDisponibles();
    const transportes = getTransportesDisponibles();

    const selectDestino = document.getElementById('destino');
    const selectTransporte = document.getElementById('transporte');

    destinos.forEach(destino => {
        const option = document.createElement('option');
        option.value = destino;
        option.textContent = destino;
        selectDestino.appendChild(option);
    });

    transportes.forEach(transporte => {
        const option = document.createElement('option');
        option.value = transporte;
        option.textContent = transporte;
        selectTransporte.appendChild(option);
    });
};

const renderizarItinerario = () => {
    const lista = document.getElementById('lista-itinerario');
    lista.innerHTML = '';

    if (destinos.length === 0) {
        lista.innerHTML = '<p>No hay viajes registrados.</p>';
        return;
    }

    destinos.forEach(viaje => {
        const div = document.createElement('div');
        div.classList.add('tarjeta-viaje');
        div.innerHTML = `
            <h4>${viaje.destino}</h4>
            <p>Fecha: ${viaje.fecha}</p>
            <p>Transporte: ${viaje.transporte}</p>
            <p>Personas: ${viaje.personas}</p>
            <p>Total: $${viaje.total.toFixed(2)}</p>
            <button class="boton" data-id="${viaje.id}">Eliminar</button>
        `;
        lista.appendChild(div);
    });

    document.querySelectorAll('.tarjeta-viaje button').forEach(boton => {
        boton.addEventListener('click', () => {
            const id = parseInt(boton.dataset.id, 10);
            eliminarViajeUI(id);
            renderizarItinerario();
        });
    });
};

const manejarEnvioFormulario = () => {
    const form = document.getElementById('form-viaje');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const destino = document.getElementById('destino').value;
        const fecha = document.getElementById('fecha').value;
        const transporte = document.getElementById('transporte').value;
        const personas = parseInt(document.getElementById('personas').value, 10);

        registrarNuevoViaje(destino, fecha, transporte, personas);
        mostrarItinerario();
        renderizarItinerario();
    });
};

const iniciarApp = () => {
    console.log("🌍 Iniciando aplicación interactiva de planificación de viajes...");
    llenarOpciones();
    manejarEnvioFormulario();
    renderizarItinerario();
};

iniciarApp();
