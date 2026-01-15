// API de PokéAPI
const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

// Array para almacenar los pokémon agregados
let pokemonesAgregados = JSON.parse(localStorage.getItem('pokemonesAgregados')) || [];

// Índice actual del pokémon mostrado
let indexActual = 1;

// Variable para almacenar el número ingresado en el teclado
let numeroIngresado = '';

// Obtener datos del pokémon por número
async function obtenerPokemon(numero) {
    try {
        const response = await fetch(API_URL + numero);
        if (!response.ok) throw new Error('Pokémon no encontrado');
        const data = await response.json();
        mostrarPokemon(data);
    } catch (error) {
        alert('Error: ' + error.message);
        console.error(error);
    }
}

// Mostrar los datos del pokémon en la pantalla
function mostrarPokemon(pokemon) {
    // Actualizar pantalla izquierda (imagen)
    document.getElementById('screen-left-image').src = pokemon.sprites.front_default || 'profesor.svg';
    document.getElementById('screen-left-image').alt = pokemon.name;

    // Actualizar altura y peso
    document.getElementById('pokemon-height').textContent = (pokemon.height / 10).toFixed(1) + ' m';
    document.getElementById('pokemon-weight').textContent = (pokemon.weight / 10).toFixed(1) + ' kg';

    // Actualizar pantalla derecha (datos)
    document.getElementById('pokemon-numero').textContent = pokemon.id;
    document.getElementById('pokemon-title').textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    // Obtener estadísticas
    const hp = pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0;
    const ataque = pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0;
    const defensa = pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0;
    const velocidad = pokemon.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0;

    document.getElementById('pokemon-hp').textContent = hp;
    document.getElementById('pokemon-attack').textContent = ataque;
    document.getElementById('pokemon-defense').textContent = defensa;
    document.getElementById('pokemon-speed').textContent = velocidad;

    // Obtener tipos y mostrar con imágenes
    const tipo1 = pokemon.types[0].type.name;
    const tipo2 = pokemon.types[1]?.type.name || null;

    mostrarTipos(tipo1, tipo2);

    // Guardar índice actual
    indexActual = pokemon.id;
}

// Mostrar tipos con imágenes
function mostrarTipos(tipo1, tipo2) {
    const tipo1Element = document.getElementById('pokemon-type-1');
    const tipo2Element = document.getElementById('pokemon-type-2');

    // Mapear tipos en inglés a español
    const tiposMap = {
        'normal': 'Normal',
        'fighting': 'Lucha',
        'flying': 'Volador',
        'poison': 'Veneno',
        'ground': 'Tierra',
        'rock': 'Roca',
        'bug': 'Bicho',
        'ghost': 'Fantasma',
        'steel': 'Acero',
        'fire': 'Fuego',
        'water': 'Agua',
        'grass': 'Planta',
        'electric': 'Electrico',
        'psychic': 'Psiquico',
        'ice': 'Hielo',
        'dragon': 'Dragon',
        'dark': 'Siniestro',
        'fairy': 'Hada'
    };

    // Formatear nombre del tipo para la ruta de imagen
    const formatoTipo = (tipo) => {
        const tipoEspanol = tiposMap[tipo.toLowerCase()] || 'desconocido';
        return 'Tipo_' + tipoEspanol + '.png';
    };

    tipo1Element.innerHTML = `<img src="./tipos/${formatoTipo(tipo1)}" alt="${tipo1}" style="max-width: 100%; height: auto;">`;
    
    if (tipo2) {
        tipo2Element.innerHTML = `<img src="./tipos/${formatoTipo(tipo2)}" alt="${tipo2}" style="max-width: 100%; height: auto;">`;
    } else {
        tipo2Element.innerHTML = `<img src="./tipos/Tipo_desconocido.png" alt="desconocido" style="max-width: 100%; height: auto;">`;
    }
}

// Navegar con las flechas de la cruz (izquierda y derecha)
function asignarNumero(elemento) {
    const numero = elemento.textContent.trim();
    
    // Si es un número, agregarlo al número ingresado
    if (!isNaN(numero) && numero !== '') {
        numeroIngresado += numero;
        document.getElementById('numero-pantalla').textContent = 'Número: ' + numeroIngresado;
    } else {
        // Navegar con flechas
        if (numero === '▲' || elemento.classList.contains('cross-top')) {
            if (indexActual < 898) {
                indexActual++;
                numeroIngresado = '';
                document.getElementById('numero-pantalla').textContent = 'Número: ';
                obtenerPokemon(indexActual);
            }
        } else if (numero === '▼' || elemento.classList.contains('cross-bottom')) {
            if (indexActual > 1) {
                indexActual--;
                numeroIngresado = '';
                document.getElementById('numero-pantalla').textContent = 'Número: ';
                obtenerPokemon(indexActual);
            }
        }
    }
}

// Buscar pokémon por número o nombre
function buscarPokemon() {
    if (numeroIngresado.trim()) {
        obtenerPokemon(numeroIngresado.toLowerCase());
        numeroIngresado = '';
        document.getElementById('numero-pantalla').textContent = 'Número: ';
    } else {
        const entrada = prompt('Ingresa el número o nombre del Pokémon:');
        if (entrada) {
            obtenerPokemon(entrada.toLowerCase());
        }
    }
}

// Limpiar el número ingresado
function limpiarNumero() {
    numeroIngresado = '';
    document.getElementById('numero-pantalla').textContent = 'Número: ';
}

// Ir al Pokémon #1 (inicio)
function irAlInicio() {
    numeroIngresado = '';
    indexActual = 1;
    document.getElementById('numero-pantalla').textContent = 'Número: ';
    obtenerPokemon(1);
}

// Agregar pokémon a la lista
async function agregarPokemon() {
    try {
        const response = await fetch(API_URL + indexActual);
        const pokemon = await response.json();
        
        const pokemonData = {
            id: pokemon.id,
            nombre: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
            hp: pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0,
            defensa: pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0,
            velocidad: pokemon.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0
        };

        // Verificar si ya existe
        const existe = pokemonesAgregados.find(p => p.id === pokemonData.id);
        if (existe) {
            alert('Este Pokémon ya está en la lista');
            return;
        }

        pokemonesAgregados.push(pokemonData);
        localStorage.setItem('pokemonesAgregados', JSON.stringify(pokemonesAgregados));
        actualizarTabla();
        alert('Pokémon agregado a la lista');
    } catch (error) {
        alert('Error al agregar pokémon: ' + error.message);
    }
}

// Actualizar tabla de pokémon agregados
function actualizarTabla() {
    const tbody = document.getElementById('contenido-tabla');
    tbody.innerHTML = '';

    pokemonesAgregados.forEach((pokemon, index) => {
        const fila = tbody.insertRow();
        fila.innerHTML = `
            <td>${pokemon.id}</td>
            <td>${pokemon.nombre}</td>
            <td>${pokemon.hp}</td>
            <td>${pokemon.defensa}</td>
            <td>${pokemon.velocidad}</td>
            <td>
                <button onclick="abrirModal(${index})">Editar</button>
                <button onclick="eliminarPokemon(${index})">Eliminar</button>
            </td>
        `;
    });
}

// Abrir modal para editar
function abrirModal(index) {
    const modal = document.getElementById('modal');
    document.getElementById('index').value = index;
    document.getElementById('nombre_editar').value = pokemonesAgregados[index].nombre;
    modal.style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
}

// Editar pokémon
function editarPokemon() {
    const index = document.getElementById('index').value;
    const nuevoNombre = document.getElementById('nombre_editar').value;

    if (nuevoNombre.trim()) {
        pokemonesAgregados[index].nombre = nuevoNombre;
        localStorage.setItem('pokemonesAgregados', JSON.stringify(pokemonesAgregados));
        actualizarTabla();
        cerrarModal();
        alert('Pokémon actualizado');
    } else {
        alert('El nombre no puede estar vacío');
    }
}

// Eliminar pokémon
function eliminarPokemon(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este Pokémon?')) {
        pokemonesAgregados.splice(index, 1);
        localStorage.setItem('pokemonesAgregados', JSON.stringify(pokemonesAgregados));
        actualizarTabla();
    }
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Alternar el desplegable de pokémon
function toggleDropdown() {
    const dropdown = document.getElementById('contenido-dropdown');
    dropdown.classList.toggle('show');
}

// Cerrar el desplegable al hacer clic fuera
window.addEventListener('click', function(event) {
    const dropdown = document.getElementById('dropdown-pokemones');
    if (!dropdown.contains(event.target)) {
        document.getElementById('contenido-dropdown').classList.remove('show');
    }
});

// Inicializar: cargar pokémon #1 y actualizar tabla
window.addEventListener('DOMContentLoaded', function() {
    obtenerPokemon(1);
    actualizarTabla();
});
