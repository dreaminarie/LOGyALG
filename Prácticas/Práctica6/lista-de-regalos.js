const gifts = ["Muñeca", "Carro de juguete", "Rompecabezas", "Lego", "Pelota", "Patineta", "Bicicleta", "Coche teledirigido", "Casa de muñecas", 
"Juego de té", "Pista de carreras", "Tren eléctrico", "Bloques de construcción", "Peluche", "Balón de fútbol", "Set de arte", "Libro de cuentos", 
"Puzzle 3D", "Robot interactivo", "Instrumento musical infantil", "Kit de ciencia", "Maletín de médico", "Superhéroe de acción", "Dinosaurio de juguete",
"Cámara instantánea para niños", "Tablero magnético", "Cubo Rubik", "Disfraz de princesa", "Disfraz de superhéroe", "Set de cocina de juguete"];

function findGift(gifts, giftName, index = 0) {
    if (index === gifts.length) {
        return `${giftName} no está en la lista.`;
    }
    
    if (gifts[index] === giftName) {
        return `${giftName} está en la posición ${index}.`;
    }
    
    return findGift(gifts, giftName, index + 1);
}

function logToConsole(message) {
    const consoleOutput = document.getElementById('console-output');
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    consoleOutput.appendChild(logEntry);
    
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function mostrarResultado(resultado) {
    const mensajeResultado = document.getElementById('mensaje-resultado');
    const resultadoContainer = document.getElementById('resultado-container');
    
    mensajeResultado.textContent = resultado;
    
    mensajeResultado.className = '';
    if (resultado.includes('no está')) {
        mensajeResultado.classList.add('regalo-no-encontrado');
    } else {
        mensajeResultado.classList.add('regalo-encontrado');
    }
    
    resultadoContainer.classList.remove('highlight-animation');
    setTimeout(() => resultadoContainer.classList.add('highlight-animation'), 10);
}

function inicializar() {
    const listaRegalosElement = document.getElementById('lista-regalos');
    gifts.forEach(gift => {
        const li = document.createElement('li');
        li.textContent = gift;
        listaRegalosElement.appendChild(li);
    });

    const buscarBtn = document.getElementById('buscar-btn');
    buscarBtn.addEventListener('click', realizarBusqueda);
    
    const regaloInput = document.getElementById('regalo-input');
    regaloInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            realizarBusqueda();
        }
    });

    logToConsole('Ejemplos predefinidos:');
    let giftToFind = "Lego";
    let result = findGift(gifts, giftToFind);
    logToConsole(`Búsqueda: "${giftToFind}" - ${result}`);
    
    giftToFind = "Camión";
    result = findGift(gifts, giftToFind);
    logToConsole(`Búsqueda: "${giftToFind}" - ${result}`);
}

function realizarBusqueda() {
    const giftName = document.getElementById('regalo-input').value.trim();
    if (giftName) {
        const resultado = findGift(gifts, giftName);
        
        mostrarResultado(resultado);
        
        logToConsole(`Búsqueda: "${giftName}" - ${resultado}`);
        
        document.getElementById('regalo-input').value = '';
    } else {
        alert('Por favor, ingresa el nombre de un regalo.');
    }
}

document.addEventListener('DOMContentLoaded', inicializar);