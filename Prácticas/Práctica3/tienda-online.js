const productos = [
    { nombre: "Camiseta", precio: 15, categoria: "Ropa" },
    { nombre: "Laptop", precio: 800, categoria: "Electrónica" },
    { nombre: "Libro", precio: 12, categoria: "Educación" },
    { nombre: "Zapatos", precio: 50, categoria: "Ropa" },
    { nombre: "Celular", precio: 600, categoria: "Electrónica" },
    { nombre: "Pantalón", precio: 35, categoria: "Ropa" },
    { nombre: "Audífonos", precio: 80, categoria: "Electrónica" },
    { nombre: "Cuaderno", precio: 5, categoria: "Educación" },
    { nombre: "Reloj", precio: 120, categoria: "Accesorios" },
    { nombre: "Monitor", precio: 250, categoria: "Electrónica" }
];

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
    
    mostrarProductos(productos);
    aplicarFiltros();
    cargarCategorias();
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

function mostrarProductos(productosList) {
    const container = document.getElementById('productos-container');
    container.innerHTML = '';
    
    productosList.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        
        card.innerHTML = `
            <div class="producto-nombre">${producto.nombre}</div>
            <div class="producto-info">
                <span class="precio">$${producto.precio}</span>
                <span class="categoria">${producto.categoria}</span>
            </div>
            <button onclick="agregarALista('${producto.nombre}')">Agregar a lista</button>
        `;
        
        container.appendChild(card);
    });
}

function agregarALista(nombre) {
    document.getElementById('producto').value = nombre;
    document.getElementById('cantidad').value = 1;
    document.getElementById('form-compras').dispatchEvent(new Event('submit'));
}

function cargarCategorias() {
    const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];
    const selectCategoria = document.getElementById('filtro-categoria');
    
    categoriasUnicas.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectCategoria.appendChild(option);
    });
}

function aplicarFiltros() {
    const precioMaximo = parseFloat(document.getElementById('filtro-precio').value) || 100;
    const categoriaSeleccionada = document.getElementById('filtro-categoria').value;
    const ordenSeleccionado = document.getElementById('orden').value;
    
    let productosFiltrados = productos.filter(p => p.precio < precioMaximo);
    
    if (categoriaSeleccionada !== 'todas') {
        productosFiltrados = productosFiltrados.filter(p => p.categoria === categoriaSeleccionada);
    }
    
    let productosParaMostrar = [...productosFiltrados];
    switch(ordenSeleccionado) {
        case 'nombre-asc':
            productosParaMostrar.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'nombre-desc':
            productosParaMostrar.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
        case 'precio-asc':
            productosParaMostrar.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio-desc':
            productosParaMostrar.sort((a, b) => b.precio - a.precio);
            break;
    }
    
    mostrarProductos(productosParaMostrar);
    
    const soloFiltrados = [...productosFiltrados];
    
    const ordenadosAlfabeticamente = [...productosFiltrados].sort((a, b) => 
        a.nombre.localeCompare(b.nombre)
    );
    
    const ordenadosPorPrecio = [...productosFiltrados].sort((a, b) => 
        a.precio - b.precio
    );
    
    const nombresProductos = ordenadosAlfabeticamente.map(p => p.nombre);
    
    actualizarListas(soloFiltrados, ordenadosAlfabeticamente, nombresProductos);
    
    const precioTotal = productosFiltrados.reduce((suma, p) => suma + p.precio, 0);
    const precioPromedio = productosFiltrados.length > 0 ? precioTotal / productosFiltrados.length : 0;
    
    const hayProductosPremium = productosFiltrados.some(p => p.precio > 500);
    
    document.getElementById('total-productos').textContent = `Total de productos: ${productosFiltrados.length}`;
    document.getElementById('precio-promedio').textContent = `Precio promedio: $${precioPromedio.toFixed(2)}`;
    document.getElementById('hay-productos-premium').textContent = hayProductosPremium ? 
        'Hay productos premium disponibles!' : 'No hay productos premium en esta selección';
}

function actualizarListas(filtrados, ordenados, nombres) {
    const listaFiltrados = document.getElementById('productos-filtrados');
    const listaOrdenados = document.getElementById('productos-ordenados');
    const listaNombres = document.getElementById('nombres-productos');
    
    listaFiltrados.innerHTML = '';
    listaOrdenados.innerHTML = '';
    listaNombres.innerHTML = '';
    
    filtrados.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.nombre} - $${p.precio} (${p.categoria})`;
        listaFiltrados.appendChild(li);
    });
    
    ordenados.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.nombre} - $${p.precio} (${p.categoria})`;
        listaOrdenados.appendChild(li);
    });
    
    nombres.forEach(nombre => {
        const li = document.createElement('li');
        li.textContent = nombre;
        listaNombres.appendChild(li);
    });
}

document.getElementById('aplicar-filtros').addEventListener('click', aplicarFiltros);

window.agregarProducto = agregarProducto;
window.eliminarProducto = eliminarProducto;
window.mostrarLista = mostrarLista;