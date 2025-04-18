const destinosDisponibles = {
    Paris: 5100,
    Londres: 4250,
    Madrid: 3400,
    Tokio: 13600,
    Roma: 3740,
    Berlin: 3910,
};

const transportes = {
    Avión: 2500,
    Tren: 1200,
    Autobús: 1000
};

const destinos = [];

const registrarDestino = (destino, fecha, transporte, personas) => {
    if (!destinosDisponibles[destino] || !transportes[transporte]) return false;

    const id = Date.now();
    const costoBase = destinosDisponibles[destino];
    const costoTransporte = transportes[transporte];
    const total = (costoBase + costoTransporte) * personas * (personas >= 3 ? 0.9 : 1);

    destinos.push({ id, destino, fecha, transporte, personas, total });

    return true;
};

const calcularCosto = () => {
    return destinos.reduce((acc, viaje) => acc + viaje.total, 0);
};

const mostrarItinerario = () => {
    console.log("\n===== ITINERARIO =====");
    destinos.forEach(viaje => {
        console.log(`📍 ${viaje.destino} - ${viaje.fecha} - ${viaje.transporte} - ${viaje.personas} personas - $${viaje.total}`);
    });
};

const eliminarViaje = (id) => {
    const indice = destinos.findIndex(viaje => viaje.id === id);
    if (indice !== -1) {
        destinos.splice(indice, 1);
        return true;
    }
    return false;
};

const getDestinosDisponibles = () => {
    return Object.keys(destinosDisponibles);
};

const getTransportesDisponibles = () => {
    return Object.keys(transportes);
};

export {
    registrarDestino,
    calcularCosto,
    mostrarItinerario,
    eliminarViaje,
    getDestinosDisponibles,
    getTransportesDisponibles,
    destinos
};
