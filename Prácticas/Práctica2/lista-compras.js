let listaDeCompras = [];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-compras');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const productoInput = document.getElementById('producto');
        const cantidadInput = document.getElementById('cantidad');
        
        const producto = productoInput.value.trim();
        const cantidad = parseInt(cantidadInput.value);
        
        if (producto && cantidad > 0) {
            agregarProducto(`${producto} (${cantidad})`);
            productoInput.value = '';
            cantidadInput.value = '1';
            productoInput.focus();
        }
    });
    
    actualizarListaUI();
});

const agregarProducto = (producto) => {
    const nombreProducto = producto.split('(')[0].trim().toLowerCase();
    
    const existeProducto = listaDeCompras.some(item => 
        item.toLowerCase().split('(')[0].trim() === nombreProducto
    );
    
    if (!existeProducto) {
        listaDeCompras.push(producto);
        console.log(`"${producto}" ha sido agregado a la lista.`);
        actualizarListaUI();
        return true;
    } else {
        console.log(`Un producto similar ya existe en la lista.`);
        return false;
    }
};

const eliminarProducto = (producto) => {
    const indiceInicial = listaDeCompras.length;
    
    listaDeCompras = listaDeCompras.filter(item => item !== producto);
    
    if (listaDeCompras.length < indiceInicial) {
        console.log(`"${producto}" ha sido eliminado de la lista.`);
        actualizarListaUI();
        return true;
    } else {
        console.log(`"${producto}" no se encontró en la lista.`);
        return false;
    }
};

const mostrarLista = () => {
    if (listaDeCompras.length === 0) {
        console.log("La lista de compras está vacía.");
    } else {
        console.log("Lista de Compras:");
        listaDeCompras.forEach((producto, indice) => {
            console.log(`${indice + 1}. ${producto}`);
        });
    }
    return listaDeCompras;
};

const actualizarListaUI = () => {
    const listaContainer = document.getElementById('lista-productos');
    
    if (listaDeCompras.length === 0) {
        listaContainer.innerHTML = '<p>La lista de compras está vacía.</p>';
    } else {
        const ul = document.createElement('ul');
        
        listaDeCompras.forEach((producto) => {
            const li = document.createElement('li');
            
            const textoProducto = document.createElement('span');
            textoProducto.textContent = producto;
            li.appendChild(textoProducto);
            
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = () => eliminarProducto(producto);
            
            li.appendChild(btnEliminar);
            ul.appendChild(li);
        });
        
        listaContainer.innerHTML = '';
        listaContainer.appendChild(ul);
    }
    
    mostrarLista();
};

window.agregarProducto = agregarProducto;
window.eliminarProducto = eliminarProducto;
window.mostrarLista = mostrarLista;