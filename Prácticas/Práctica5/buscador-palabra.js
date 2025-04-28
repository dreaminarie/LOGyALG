const consoleOutput = document.getElementById('console-output');
const originalLog = console.log;

console.log = function(...args) {
    originalLog.apply(console, args);

    const text = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');

    consoleOutput.innerHTML += text + '<br>';
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
};

function findLongestWord(text) {
    const words = text.split(/\s+/);
    
    console.log("Palabras identificadas:", words);

    let longestWord = ''; 
    
    for (let i = 0; i < words.length; i++) {
        
        const cleanWord = words[i].replace(/[.,;:!?()'"\[\]{}]/g, '');
        
        console.log(`Ventana en posición ${i}: "${cleanWord}" (longitud: ${cleanWord.length})`);
        
        if (cleanWord.length > longestWord.length) {
            longestWord = cleanWord;
            console.log(`¡Nueva palabra más larga encontrada: "${longestWord}"!`);
        } else {
            console.log(`Mantiene la palabra más larga actual: "${longestWord}"`);
        }
    }
    
    console.log(`Palabra más larga final: "${longestWord}" con ${longestWord.length} caracteres`);
    
    return longestWord;
}

function highlightLongestWord(text, word) {
    if (!word) return text;
    
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
    
    if (!text.match(regex)) {
        const simpleRegex = new RegExp(escapedWord, 'gi');
        return text.replace(simpleRegex, `<span class="highlight">$&</span>`);
    }
    
    return text.replace(regex, `<span class="highlight">$&</span>`);
}

document.getElementById('analizar-btn').addEventListener('click', function() {
    consoleOutput.innerHTML = '';
    
    const texto = document.getElementById('texto-input').value;
    
    console.log("Iniciando análisis del texto:");
    console.log(texto);
    
    const palabraMasLarga = findLongestWord(texto);
    
    document.getElementById('palabra-resultado').textContent = palabraMasLarga;
    document.getElementById('longitud-resultado').textContent = palabraMasLarga.length;
    
    document.getElementById('texto-con-highlight').innerHTML = 
        `<p>Texto con la palabra más larga resaltada:</p>
        <p>${highlightLongestWord(texto, palabraMasLarga)}</p>`;
    
    document.getElementById('resultado-container').style.display = 'block';
    
    console.log("Análisis completado.");
});

window.addEventListener('load', function() {
    document.getElementById('analizar-btn').click();
});