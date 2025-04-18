import {
    registrarDestino,
    mostrarItinerario,
    eliminarViaje,
    getDestinosDisponibles,
    getTransportesDisponibles
} from './gestor-viajes.js';

const registrarNuevoViaje = (destino, fecha, transporte, personas) => {
    console.log(`\nRegistrando viaje a ${destino}...`);

    const resultado = registrarDestino(destino, fecha, transporte, personas);

    if (resultado) {
        console.log("✅ Viaje registrado correctamente.");
    } else {
        console.log("❌ No se pudo registrar el viaje. Verifica los datos.");
    }
};

const eliminarViajeUI = (id) => {
    console.log(`\nEliminando viaje con ID ${id}...`);

    const resultado = eliminarViaje(id);

    if (resultado) {
        console.log("✅ Viaje eliminado correctamente.");
    } else {
        console.log("❌ No se encontró ningún viaje con ese ID.");
    }
};

const mostrarDestinosDisponibles = () => {
    const destinos = getDestinosDisponibles();

    console.log("\n===== DESTINOS DISPONIBLES =====");
    destinos.forEach(destino => {
        console.log(`- ${destino}`);
    });
};

const mostrarTransportesDisponibles = () => {
    const transportes = getTransportesDisponibles();

    console.log("\n===== TRANSPORTES DISPONIBLES =====");
    transportes.forEach(transporte => {
        console.log(`- ${transporte}`);
    });
};

export {
    registrarNuevoViaje,
    eliminarViajeUI,
    mostrarDestinosDisponibles,
    mostrarTransportesDisponibles
};
