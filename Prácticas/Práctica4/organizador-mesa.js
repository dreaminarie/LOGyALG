const listaInvitadosTextarea = document.getElementById('lista-invitados');
const buscarParejaBtn = document.getElementById('buscar-pareja');
const invitadosContainer = document.getElementById('invitados-container');
const resultado = document.getElementById('resultado');
const mensajeResultado = document.getElementById('mensaje-resultado');
const parejaEncontrada = document.getElementById('pareja-encontrada');
const consola = document.getElementById('consola');

function imprimirConsola(mensaje) {
    consola.textContent += mensaje + '\n';
    consola.scrollTop = consola.scrollHeight;
}

function limpiarConsola() {
    consola.textContent = "// Consola de ejecución del algoritmo\n";
}

function mostrarInvitados(invitados) {
    invitadosContainer.innerHTML = '';
    
    invitados.forEach(invitado => {
        const invitadoDiv = document.createElement('div');
        invitadoDiv.className = 'invitado';
        invitadoDiv.textContent = invitado;
        invitadoDiv.dataset.inicial = invitado[0].toUpperCase();
        
        invitadosContainer.appendChild(invitadoDiv);
    });
}

function mostrarResultado(pareja) {
    if (pareja) {
        resultado.style.display = 'block';
        mensajeResultado.textContent = `¡Se ha encontrado una pareja compatible! ${pareja[0]} y ${pareja[1]} pueden sentarse juntos porque ambos nombres comienzan con la letra "${pareja[0][0].toUpperCase()}".`;
        
        parejaEncontrada.innerHTML = '';
        pareja.forEach(nombre => {
            const miembroDiv = document.createElement('div');
            miembroDiv.className = 'pareja-miembro';
            miembroDiv.textContent = nombre;
            miembroDiv.dataset.inicial = nombre[0].toUpperCase();
            
            parejaEncontrada.appendChild(miembroDiv);
        });
        
        document.querySelectorAll('.invitado').forEach(div => {
            if (pareja.includes(div.textContent)) {
                div.classList.add('destacado');
            } else {
                div.classList.remove('destacado');
            }
        });
    } else {
        resultado.style.display = 'block';
        mensajeResultado.textContent = "No se encontró ninguna pareja compatible en la lista de invitados.";
        parejaEncontrada.innerHTML = '';
        
        document.querySelectorAll('.invitado').forEach(div => {
            div.classList.remove('destacado');
        });
    }
}

function encontrarPareja(arr) {
    limpiarConsola();
    imprimirConsola("Iniciando búsqueda de parejas compatibles...");
    imprimirConsola(`Lista de invitados: [${arr.join(", ")}]`);
    
    let inicio = 0;
    let siguiente = 1;

    while (siguiente < arr.length) {
        const inicialInicio = arr[inicio][0];
        const inicialSiguiente = arr[siguiente][0];
        
        imprimirConsola(`Comparando ${arr[inicio]} (${inicialInicio}) con ${arr[siguiente]} (${inicialSiguiente})`);
        
        if (inicialInicio === inicialSiguiente) {
            imprimirConsola(`¡Coincidencia encontrada! Ambos nombres comienzan con "${inicialInicio}"`);
            return [arr[inicio], arr[siguiente]];
        }
        
        imprimirConsola("No hay coincidencia. Avanzando punteros...");
        
        inicio++;
        siguiente++;
    }

    imprimirConsola("Búsqueda finalizada. No se encontraron parejas compatibles.");
    return null;
}

buscarParejaBtn.addEventListener('click', function() {
    const invitadosTexto = listaInvitadosTextarea.value.trim();
    const invitados = invitadosTexto.split('\n')
        .map(nombre => nombre.trim())
        .filter(nombre => nombre !== '');
    
    if (invitados.length < 2) {
        alert("Necesitas al menos dos invitados para buscar parejas compatibles.");
        return;
    }
    
    const invitadosOrdenados = [...invitados].sort((a, b) => 
        a.toLowerCase().localeCompare(b.toLowerCase())
    );
    
    listaInvitadosTextarea.value = invitadosOrdenados.join('\n');
    
    mostrarInvitados(invitadosOrdenados);
    
    const pareja = encontrarPareja(invitadosOrdenados);
    
    mostrarResultado(pareja);
});

listaInvitadosTextarea.value = invitadosOrdenados.join('\n');

document.addEventListener('DOMContentLoaded', function() {
    const invitadosDefault = listaInvitadosTextarea.value.trim().split('\n').map(nombre => nombre.trim());
    mostrarInvitados(invitadosDefault);
    
    buscarParejaBtn.click();
});