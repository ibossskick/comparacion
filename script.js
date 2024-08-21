let productos = [];
let contador = 1;

const btnAgregar = document.getElementById('agregarProducto');
const btnBorrar = document.getElementById('borrarProductos');
const sumaTotal = document.getElementById('sumaTotal');
const ahorroTotal = document.getElementById('ahorroTotal'); // Nuevo elemento para mostrar el ahorro

// Función para actualizar el total
function actualizarTotal() {
    const total = productos.reduce((sum, producto) => sum + producto.precio, 0);
    sumaTotal.textContent = total.toFixed(2);
}

// Función para calcular el ahorro
function calcularAhorro() {
    if (productos.length === 0) return;

    const precioMasBarato = productos[0].precioPorUnidad; // El precio más barato es el primer elemento después de ordenar
    let ahorro = 0;

    productos.forEach(producto => {
        if (producto.precioPorUnidad > precioMasBarato) {
            ahorro += (producto.precioPorUnidad - precioMasBarato) * producto.cantidad; // Calcula el ahorro por cada producto
        }
    });

    ahorroTotal.textContent = ahorro.toFixed(2); // Muestra el ahorro total
}

// Función para borrar todos los productos
btnBorrar.addEventListener('click', function() {
    productos = []; // Vacía el arreglo de productos
    contador = 1; // Reinicia el contador
    document.getElementById('productos').innerHTML = ''; // Limpia la visualización de productos
    actualizarTotal(); // Actualiza el total a 0
    ahorroTotal.textContent = '0'; // Resetea el ahorro a 0
});

// Limitar el número de productos a 10
btnAgregar.addEventListener('click', function() {
    if (productos.length < 10) {
        const producto = {
            id: contador++,
            precio: 0,
            unidad: '',
            cantidad: 0
        };

        productos.push(producto);

        const divProducto = document.createElement('div');
        divProducto.innerHTML = `
            <label>Producto ${producto.id}:</label>
            <input type="number" placeholder="Precio en CLP" id="precio${producto.id}">
            <input type="number" placeholder="Cantidad" id="cantidad${producto.id}">
            <select id="unidad${producto.id}">
                <option value="ml">ml</option>
                <option value="L">L</option>
                <option value="gr">gr</option>
                <option value="kg">kg</option>
            </select>
            <button onclick="calcular()">Calcular</button>
            <span id="precioUnidad${producto.id}"></span>
        `;

        document.getElementById('productos').appendChild(divProducto);
    } else {
        alert('No puedes agregar más de 10 productos.');
    }
});

function calcular() {
    productos = productos.map(producto => {
        const precioElemento = document.getElementById(`precio${producto.id}`);
        const cantidadElemento = document.getElementById(`cantidad${producto.id}`);
        const unidadElemento = document.getElementById(`unidad${producto.id}`);

        // Verificar si los elementos existen antes de intentar acceder a sus valores
        if (!precioElemento || !cantidadElemento || !unidadElemento) {
            console.error(`No se encontró un elemento para el producto ${producto.id}`);
            return producto;
        }

        const precio = parseFloat(precioElemento.value);
        const cantidad = parseFloat(cantidadElemento.value);
        const unidad = unidadElemento.value;

        // Verificar si el precio y la cantidad son números válidos
        if (isNaN(precio) || isNaN(cantidad)) {
            console.error(`Valores no válidos para el producto ${producto.id}`);
            return producto;
        }

        let cantidadConvertida = cantidad;
        if (unidad === 'L') {
            cantidadConvertida = cantidad * 1000;
        } else if (unidad === 'kg') {
            cantidadConvertida = cantidad * 1000;
        }

        const precioPorUnidad = precio / cantidadConvertida;

        // Actualizar visualmente el precio por unidad en la interfaz
        const precioUnidadElemento = document.getElementById(`precioUnidad${producto.id}`);
        if (precioUnidadElemento) {
            precioUnidadElemento.textContent = ` - Precio por unidad: $${precioPorUnidad.toFixed(2)} CLP`;
            precioUnidadElemento.style.color = (producto.precioPorUnidad === productos[0].precioPorUnidad) ? 'green' : 'black';
        }

        return { ...producto, precio, cantidad: cantidadConvertida, unidad, precioPorUnidad };
    });

    productos.sort((a, b) => a.precioPorUnidad - b.precioPorUnidad);

    actualizarTotal(); // Actualiza el total después de calcular
    calcularAhorro();  // Calcula el ahorro después de calcular
}
