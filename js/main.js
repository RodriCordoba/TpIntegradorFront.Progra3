const url = "http://localhost:3000/api";
let productos = [];
let carrito = [];

async function init() {
  
  try {
  
    const res = await fetch(`${url}/products`);
    const data = await res.json();
    productos = data.payload;

    mostrarProductos(productos);
    cargarCarritoDesdeStorage();
    activarEventos();
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

function mostrarProductos(array) {
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = "";

  array.forEach((producto) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-producto");

    tarjeta.innerHTML = `
      <img src="${producto.image}" alt="${producto.name}" />
      <h3>${producto.name}</h3>
      <p>Precio: $${producto.price.toFixed(2)}</p>
      <button class="boton-agregar" data-id="${producto.id}">Agregar al carrito</button>
    `;

    contenedor.appendChild(tarjeta);
  });

  // Asignar eventos a botones agregar
  const botonesAgregar = document.querySelectorAll(".boton-agregar");
  botonesAgregar.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      agregarAlCarrito(id);
    });
  });
}

function agregarAlCarrito(idProducto) {
  const producto = productos.find((p) => p.id === idProducto);
  if (producto) {
    carrito.push(producto);
    mostrarCarrito();
    guardarCarritoEnStorage();
  }
}

function mostrarCarrito() {
  const contenedor = document.getElementById("items-carrito");
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>No hay elementos en el carrito.</p>";
    actualizarTotalCarrito();
    return;
  }

  carrito.forEach((producto, index) => {
    const li = document.createElement("li");
    li.classList.add("bloque-item");

    li.innerHTML = `
      <p class="nombre-item">${producto.name} - $${producto.price}</p>
      <button class="boton-eliminar" data-index="${index}">Eliminar</button>
    `;

    contenedor.appendChild(li);
  });

  const botonesEliminar = contenedor.querySelectorAll(".boton-eliminar");
  botonesEliminar.forEach((btn) => {
    btn.addEventListener("click", eliminarProducto);
  });

  actualizarTotalCarrito();
}

function eliminarProducto(e) {
  const index = e.target.getAttribute("data-index");
  carrito.splice(index, 1);
  mostrarCarrito();
  guardarCarritoEnStorage();
}

function actualizarTotalCarrito() {
  const total = carrito.reduce((suma, prod) => suma + prod.price, 0);
  document.getElementById("precio-total").textContent = `$${total.toFixed(2)}`;
}

function guardarCarritoEnStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDesdeStorage() {
  const data = localStorage.getItem("carrito");
  if (data) {
    carrito = JSON.parse(data);
    mostrarCarrito();
  }
}

function filtrarProductos(event) {
  const texto = event.target.value.toLowerCase();
  const filtrados = productos.filter((p) =>
    p.name.toLowerCase().includes(texto)
  );
  mostrarProductos(filtrados);
}

function activarEventos() {
  document
    .getElementById("inputbuscar")
    .addEventListener("input", filtrarProductos);

  document
    .getElementById("ordenar-nombre")
    .addEventListener("click", () => {
      const ordenados = [...productos].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      mostrarProductos(ordenados);
    });

  document
    .getElementById("ordenar-precio")
    .addEventListener("click", () => {
      const ordenados = [...productos].sort((a, b) => a.price - b.price);
      mostrarProductos(ordenados);
    });

  document
    .getElementById("vaciar-carrito")
    .addEventListener("click", () => {
      carrito = [];
      mostrarCarrito();
      guardarCarritoEnStorage();
    });
}

window.onload = init;
