// --- Datos de Vinos ---
const listaVinos = [
  'Caramañola Tinto 375', 'Caramañola Blanco 375', 'Caramañola Tinto 750',
  'Caramañola Blanco 750', 'San Felipe Roble', 'San Humberto Reserva',
  'San Humberto Centenario', 'San Humberto Joven', 'San Humberto Chardonnay',
  'Cruz Alta Malbec', 'Cruz Alta Chardonnay', 'La Vuelta', 'Cepa Tradicional',
  'Sade', 'Trumpeter'
];

// --- Elementos del DOM ---
let vinosTableBody = document.getElementById('vinosTableBody');
let compartirStockButton = document.getElementById('compartir-stock');
let statusMessageDiv = document.getElementById('statusMessage');
let ultimaModificacionDiv = document.getElementById('ultimaModificacion');

// --- Funciones ---

const inicializarElementosDOM = () => {
  if (!vinosTableBody) {
    console.error('Error: No se encontró el elemento #vinosTableBody');
    return false;
  }
  return true;
};

const generarTablaVinos = (vinos, stockActual = {}) => {
  console.log('Generando tabla con vinos:', vinos, 'y stock:', stockActual);
  vinosTableBody.innerHTML = '';
  if (!vinos || vinos.length === 0) {
    const fila = document.createElement('tr');
    const celda = document.createElement('td');
    celda.colSpan = 2;
    celda.textContent = 'No hay vinos definidos.';
    celda.style.textAlign = 'center';
    fila.appendChild(celda);
    vinosTableBody.appendChild(fila);
    return;
  }
  vinos.forEach(vino => {
    const fila = document.createElement('tr');
    const vinoCelda = document.createElement('td');
    vinoCelda.textContent = vino;
    const cantidadCelda = document.createElement('td');
    const inputCantidad = document.createElement('input');
    inputCantidad.type = 'number';
    inputCantidad.value = stockActual[vino] || '';
    inputCantidad.min = '0';
    inputCantidad.placeholder = '0';
    inputCantidad.dataset.vino = vino;
    cantidadCelda.appendChild(inputCantidad);
    fila.appendChild(vinoCelda);
    fila.appendChild(cantidadCelda);
    vinosTableBody.appendChild(fila);
  });
  actualizarEstadoBoton();
};

const actualizarEstadoBoton = () => {
  const inputsCantidad = vinosTableBody.querySelectorAll('input[type="number"]');
  let hayDatos = false;
  inputsCantidad.forEach(input => {
    const cantidad = parseInt(input.value, 10);
    if (!isNaN(cantidad) && cantidad >= 0) {
      hayDatos = true;
    }
  });
  compartirStockButton.disabled = !hayDatos;
};

const mostrarMensaje = (message, isError = false) => {
  statusMessageDiv.textContent = message;
  statusMessageDiv.className = isError ? 'error' : 'success';
  console.log(isError ? 'Error mostrado:' : 'Mensaje mostrado:', message);
};

const recopilarDatosStock = () => {
  const filas = vinosTableBody.querySelectorAll('tr');
  let stockItems = [];
  filas.forEach(fila => {
    const vinoCelda = fila.querySelector('td:first-child');
    const cantidadInput = fila.querySelector('input[type="number"]');
    if (vinoCelda && cantidadInput) {
      const cantidad = parseInt(cantidadInput.value, 10);
      if (!isNaN(cantidad) && cantidad >= 0) {
        const vino = vinoCelda.textContent.trim();
        stockItems.push({ vino, cantidad });
      }
    }
  });
  return stockItems;
};

const compartirStock = () => {
  const stockItems = recopilarDatosStock();
  if (stockItems.length === 0) {
    mostrarMensaje('Por favor, ingrese la cantidad para al menos un vino.', true);
    return;
  }

  // Convertir los datos a un formato de texto
  let mensaje = "Stock de Vinos:\n\n";
  stockItems.forEach(item => {
    mensaje += `${item.vino}: ${item.cantidad}\n`;
  });

  // Codificar el mensaje para la URL de WhatsApp
  const mensajeWhatsApp = encodeURIComponent(mensaje);

  // Crear la URL de WhatsApp
  const urlWhatsApp = `https://wa.me/?text=${mensajeWhatsApp}`;

  // Abrir la URL en una nueva ventana
  window.open(urlWhatsApp, '_blank');
};

const configurarEventListeners = () => {
  vinosTableBody.addEventListener('input', (event) => {
    if (event.target.type === 'number') {
      statusMessageDiv.textContent = '';
      actualizarEstadoBoton();
    }
  });
  compartirStockButton.addEventListener('click', compartirStock);
};

// --- Inicialización ---
window.onload = () => {
  console.log('Página cargada, inicializando...');
  if (inicializarElementosDOM()) {
    console.log('Elementos del DOM inicializados correctamente');
    generarTablaVinos(listaVinos);
    configurarEventListeners();
  } else {
    console.error('No se pudieron inicializar los elementos del DOM');
  }
};
