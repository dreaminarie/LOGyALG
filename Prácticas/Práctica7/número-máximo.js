const numeroInput = document.getElementById('numero-input');
const agregarBtn = document.getElementById('agregar-btn');
const ejemploBtn = document.getElementById('ejemplo-btn');
const limpiarBtn = document.getElementById('limpiar-btn');
const buscarMaxBtn = document.getElementById('buscar-max-btn');
const listaNumeros = document.getElementById('lista-numeros');
const mensajeResultado = document.getElementById('mensaje-resultado');
const consoleOutput = document.getElementById('console-output');

let numeros = [];

let nivelRecursion = 0;

function limpiarConsola() {
    consoleOutput.innerHTML = '';
}

function consoleLog(mensaje, tipo) {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${tipo || ''}`;
    
    let espacios = '';
    for(let i = 0; i < nivelRecursion; i++) {
        espacios += '│ ';
    }
    
    logEntry.textContent = espacios + mensaje;
    consoleOutput.appendChild(logEntry);
    
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function findMax(arr) {
    nivelRecursion++;
    
    if (arr.length === 1) {
        consoleLog(`Caso base: arreglo [${arr}] tiene un solo elemento, retornando ${arr[0]}`, 'log-base');
        nivelRecursion--;
        return arr[0];
    }
    
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    consoleLog(`Dividir: [${arr}] en [${left}] y [${right}]`, 'log-divide');
    
    consoleLog(`Analizando mitad izquierda: [${left}]`, 'log-divide');
    const leftMax = findMax(left);
    consoleLog(`Máximo en mitad izquierda: ${leftMax}`, 'log-conquer');
    
    consoleLog(`Analizando mitad derecha: [${right}]`, 'log-divide');
    const rightMax = findMax(right);
    consoleLog(`Máximo en mitad derecha: ${rightMax}`, 'log-conquer');
    
    // Combinar
    const resultado = Math.max(leftMax, rightMax);
    consoleLog(`Comparando máximos: ${leftMax} vs ${rightMax} -> ${resultado}`, 'log-conquer');
    
    nivelRecursion--;
    return resultado;
}

function actualizarLista() {
    listaNumeros.innerHTML = '';
    numeros.forEach(num => {
        const li = document.createElement('li');
        li.textContent = num;
        listaNumeros.appendChild(li);
    });
    
    if (numeros.length === 0) {
        mensajeResultado.textContent = 'Agrega números a la lista para encontrar el máximo';
    } else {
        mensajeResultado.textContent = 'Presiona "Encontrar el Máximo" para ejecutar el algoritmo';
    }
}

agregarBtn.addEventListener('click', () => {
    const valor = parseInt(numeroInput.value);
    if (!isNaN(valor)) {
        numeros.push(valor);
        numeroInput.value = '';
        actualizarLista();
    } else {
        alert('Por favor ingresa un número válido');
    }
});

numeroInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        agregarBtn.click();
    }
});

ejemploBtn.addEventListener('click', () => {
    numeros = [3, 8, 2, 10, 5, 7];
    actualizarLista();
});

limpiarBtn.addEventListener('click', () => {
    numeros = [];
    actualizarLista();
    limpiarConsola();
});

buscarMaxBtn.addEventListener('click', () => {
    if (numeros.length === 0) {
        alert('Por favor agrega al menos un número a la lista');
        return;
    }
    
    limpiarConsola();
    nivelRecursion = 0;
    
    consoleLog('Iniciando búsqueda del máximo con Divide and Conquer', '');
    consoleLog(`Arreglo de entrada: [${numeros}]`, '');
    
    const resultado = findMax([...numeros]);
    
    mensajeResultado.textContent = `El número máximo es: ${resultado}`;
    consoleLog(`Resultado final: El máximo es ${resultado}`, 'log-result');
});

actualizarLista();