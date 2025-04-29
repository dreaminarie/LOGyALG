function log(message) {
    const consoleOutput = document.getElementById('console-output');
    const timestamp = new Date().toLocaleTimeString();
    consoleOutput.innerHTML += `[${timestamp}] ${message}\n`;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

const originalConsoleLog = console.log;
console.log = function(message) {
    originalConsoleLog.apply(console, arguments);
    log(message);
};

function mostrarResultado(mensaje, esError = false) {
    const mensajeResultado = document.getElementById('mensaje-resultado');
    mensajeResultado.textContent = mensaje;
    
    const resultadoContainer = document.getElementById('resultado-container');
    resultadoContainer.style.borderLeft = esError ? '4px solid #ff6b6b' : '4px solid var(--color-primario)';
}

function resaltarTexto(texto, busqueda) {
    if (!busqueda) return texto;
    
    const regex = new RegExp(busqueda.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return texto.replace(regex, match => `<span class="resaltado">${match}</span>`);
}

class GestorNotas {
    constructor() {
        this.cargarNotas();
        this.ultimaBusqueda = '';
    }

    cargarNotas() {
        const notasGuardadas = localStorage.getItem('notas');
        
        if (notasGuardadas) {
            this.notas = JSON.parse(notasGuardadas);
        } else {
            try {
                fetch('notas.json')
                    .then(response => response.json())
                    .then(data => {
                        this.notas = data;
                        this.guardarNotas(); 
                        this.actualizarVistaNotas();
                        console.log('Notas cargadas desde notas.json');
                    })
                    .catch(error => {
                        console.log('No se pudo cargar notas.json. Iniciando con lista vacía.');
                        this.notas = [];
                        this.guardarNotas();
                    });
            } catch (error) {
                console.log('Error al intentar cargar notas.json');
                this.notas = [];
            }
        }
        
        if (!this.notas) {
            this.notas = [];
        }
        
        this.actualizarVistaNotas();
        return this.notas;
    }

    guardarNotas() {
        localStorage.setItem('notas', JSON.stringify(this.notas));
        this.actualizarVistaNotas();
    }

    agregarNota(titulo, contenido) {
        if (!titulo || !contenido) {
            console.log('Error: El título y el contenido son obligatorios.');
            mostrarResultado('Error: El título y el contenido son obligatorios.', true);
            return false;
        }

        const notaExistente = this.notas.find(nota => nota.titulo === titulo);
        if (notaExistente) {
            console.log(`Ya existe una nota con el título "${titulo}".`);
            mostrarResultado(`Ya existe una nota con el título "${titulo}".`, true);
            return false;
        }

        const nuevaNota = { titulo, contenido };
        this.notas.push(nuevaNota);
        this.guardarNotas();
        console.log(`Nota agregada con éxito: "${titulo}"`);
        mostrarResultado(`Nota agregada con éxito: "${titulo}"`);
        return true;
    }

    eliminarNota(titulo) {
        const cantidadOriginal = this.notas.length;
        this.notas = this.notas.filter(nota => nota.titulo !== titulo);
        
        if (this.notas.length < cantidadOriginal) {
            this.guardarNotas();
            console.log(`Nota con título "${titulo}" eliminada.`);
            mostrarResultado(`Nota con título "${titulo}" eliminada.`);
            return true;
        } else {
            console.log(`No se encontró ninguna nota con el título "${titulo}".`);
            mostrarResultado(`No se encontró ninguna nota con el título "${titulo}".`, true);
            return false;
        }
    }

    buscarNotas(texto) {
        this.ultimaBusqueda = texto ? texto.toLowerCase() : '';
        
        if (!texto) {
            this.actualizarVistaNotas(this.notas);
            console.log('Mostrando todas las notas.');
            mostrarResultado('Mostrando todas las notas.');
            return this.notas;
        }
        
        const resultados = this.notas.filter(nota => {
            const tituloCoincide = nota.titulo.toLowerCase().includes(texto.toLowerCase());
            const contenidoCoincide = nota.contenido.toLowerCase().includes(texto.toLowerCase());
            
            if (tituloCoincide || contenidoCoincide) {
                return {
                    ...nota,
                    coincideTitulo: tituloCoincide,
                    coincideContenido: contenidoCoincide
                };
            }
            return tituloCoincide || contenidoCoincide;
        });
        
        this.actualizarVistaNotas(resultados);
        
        if (resultados.length > 0) {
            console.log(`Se encontraron ${resultados.length} notas con "${texto}".`);
            mostrarResultado(`Se encontraron ${resultados.length} notas con "${texto}".`);
        } else {
            console.log(`No se encontraron notas que contengan "${texto}".`);
            mostrarResultado(`No se encontraron notas que contengan "${texto}".`, true);
        }
        
        return resultados;
    }

    actualizarVistaNotas(notasAMostrar = null) {
        const notasContainer = document.getElementById('notas-container');
        const notasEmptyMessage = document.getElementById('notas-empty-message') || 
            this.crearMensajeVacio();
        
        const notasParaMostrar = notasAMostrar === null ? this.notas : notasAMostrar;
        
        notasContainer.innerHTML = '';
        
        if (notasParaMostrar.length === 0) {
            notasContainer.appendChild(notasEmptyMessage);
        } else {
            notasParaMostrar.forEach(nota => {
                const notaElement = document.createElement('div');
                notaElement.className = 'nota';
                
                const tituloCoincide = this.ultimaBusqueda && 
                    nota.titulo.toLowerCase().includes(this.ultimaBusqueda);
                const contenidoCoincide = this.ultimaBusqueda && 
                    nota.contenido.toLowerCase().includes(this.ultimaBusqueda);
                
                if (this.ultimaBusqueda) {
                    const indicadoresDiv = document.createElement('div');
                    indicadoresDiv.className = 'coincidencia-indicadores';
                    
                    if (tituloCoincide) {
                        const tituloBadge = document.createElement('span');
                        tituloBadge.className = 'badge coincide-titulo';
                        tituloBadge.textContent = 'Coincide en título';
                        indicadoresDiv.appendChild(tituloBadge);
                    }
                    
                    if (contenidoCoincide) {
                        const contenidoBadge = document.createElement('span');
                        contenidoBadge.className = 'badge coincide-contenido';
                        contenidoBadge.textContent = 'Coincide en contenido';
                        indicadoresDiv.appendChild(contenidoBadge);
                    }
                    
                    if (tituloCoincide || contenidoCoincide) {
                        notaElement.appendChild(indicadoresDiv);
                    }
                }
                
                const tituloElement = document.createElement('h4');
                if (this.ultimaBusqueda && tituloCoincide) {
                    tituloElement.innerHTML = resaltarTexto(nota.titulo, this.ultimaBusqueda);
                } else {
                    tituloElement.textContent = nota.titulo;
                }
                
                const contenidoElement = document.createElement('p');
                if (this.ultimaBusqueda && contenidoCoincide) {
                    contenidoElement.innerHTML = resaltarTexto(nota.contenido, this.ultimaBusqueda);
                } else {
                    contenidoElement.textContent = nota.contenido;
                }
                
                const botonesElement = document.createElement('div');
                botonesElement.className = 'nota-botones';
                
                const eliminarBtn = document.createElement('button');
                eliminarBtn.className = 'eliminar-btn';
                eliminarBtn.textContent = 'Eliminar';
                eliminarBtn.onclick = () => this.eliminarNota(nota.titulo);
                
                botonesElement.appendChild(eliminarBtn);
                notaElement.appendChild(tituloElement);
                notaElement.appendChild(contenidoElement);
                notaElement.appendChild(botonesElement);
                
                notasContainer.appendChild(notaElement);
            });
        }
    }
    
    crearMensajeVacio() {
        const mensajeVacio = document.createElement('div');
        mensajeVacio.id = 'notas-empty-message';
        mensajeVacio.className = 'notas-empty-message';
        mensajeVacio.textContent = 'No se encontraron notas.';
        return mensajeVacio;
    }

    cargarEjemplos() {
        const ejemplos = [
            { titulo: "Compras", contenido: "Comprar leche y pan." },
            { titulo: "Trabajo", contenido: "Terminar reporte semanal." },
            { titulo: "Recordatorio", contenido: "Llamar al médico el viernes." }
        ];
        
        let notasAgregadas = 0;
        
        ejemplos.forEach(ejemplo => {
            const notaExistente = this.notas.find(nota => nota.titulo === ejemplo.titulo);
            if (!notaExistente) {
                this.notas.push(ejemplo);
                notasAgregadas++;
            }
        });
        
        if (notasAgregadas > 0) {
            this.guardarNotas();
            console.log(`Se agregaron ${notasAgregadas} notas de ejemplo.`);
            mostrarResultado(`Se agregaron ${notasAgregadas} notas de ejemplo.`);
        } else {
            console.log('Las notas de ejemplo ya estaban cargadas.');
            mostrarResultado('Las notas de ejemplo ya estaban cargadas.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gestor = new GestorNotas();
    
    const tituloInput = document.getElementById('titulo-input');
    const contenidoInput = document.getElementById('contenido-input');
    const agregarBtn = document.getElementById('agregar-btn');
    const cargarEjemplosBtn = document.getElementById('cargar-ejemplos-btn');
    const limpiarFormBtn = document.getElementById('limpiar-form-btn');
    const buscarInput = document.getElementById('buscar-input');
    const buscarBtn = document.getElementById('buscar-btn');
    
    agregarBtn.addEventListener('click', () => {
        const titulo = tituloInput.value.trim();
        const contenido = contenidoInput.value.trim();
        
        if (gestor.agregarNota(titulo, contenido)) {
            tituloInput.value = '';
            contenidoInput.value = '';
        }
    });
    
    cargarEjemplosBtn.addEventListener('click', () => {
        gestor.cargarEjemplos();
    });
    
    limpiarFormBtn.addEventListener('click', () => {
        tituloInput.value = '';
        contenidoInput.value = '';
        mostrarResultado('Formulario limpiado.');
    });
    
    buscarBtn.addEventListener('click', () => {
        const texto = buscarInput.value.trim();
        gestor.buscarNotas(texto);
    });
    
    buscarInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            buscarBtn.click();
        }
    });
    
    const limpiarBusquedaBtn = document.createElement('button');
    limpiarBusquedaBtn.id = 'limpiar-busqueda-btn';
    limpiarBusquedaBtn.textContent = 'Limpiar búsqueda';
    limpiarBusquedaBtn.className = 'boton-secundario';
    limpiarBusquedaBtn.addEventListener('click', () => {
        buscarInput.value = '';
        gestor.buscarNotas('');
    });
    
    buscarBtn.parentNode.insertBefore(limpiarBusquedaBtn, buscarBtn.nextSibling);
    
    console.log('=== Gestor de Notas Personales ===');
    console.log('Aplicación web iniciada correctamente.');
});