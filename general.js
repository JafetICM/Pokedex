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

// FUNCIÓN DE BATALLA
let pokemonBatalla1 = null;
let pokemonBatalla2 = null;

// Obtener datos del Pokémon para batalla
async function obtenerPokemonBatalla(numero) {
    try {
        const response = await fetch(API_URL + numero);
        if (!response.ok) throw new Error('Pokémon no encontrado');
        const data = await response.json();
        return {
            id: data.id,
            nombre: data.name,
            imagen: data.sprites.front_default,
            hp: data.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0,
            ataque: data.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0,
            defensa: data.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0,
            velocidad: data.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0
        };
    } catch (error) {
        alert('Error: ' + error.message);
        return null;
    }
}

// Abrir modal de batalla
async function abrirBatalla(numeroPokemon) {
    pokemonBatalla1 = await obtenerPokemonBatalla(indexActual);
    pokemonBatalla2 = await obtenerPokemonBatalla(numeroPokemon);
    
    if (pokemonBatalla1 && pokemonBatalla2) {
        mostrarInfoBatalla();
        document.getElementById('modal-batalla').style.display = 'block';
    }
}

// Batalla desde Pokémon actual
async function abrirBatallaDesdeActual() {
    pokemonBatalla1 = await obtenerPokemonBatalla(indexActual);
    const pokemonAleatorio = Math.floor(Math.random() * 898) + 1;
    pokemonBatalla2 = await obtenerPokemonBatalla(pokemonAleatorio);
    
    if (pokemonBatalla1 && pokemonBatalla2) {
        mostrarInfoBatalla();
        document.getElementById('modal-batalla').style.display = 'block';
    }
}

// Mostrar información de batalla
function mostrarInfoBatalla() {
    // Pokémon 1
    document.getElementById('batalla-p1-nombre').textContent = pokemonBatalla1.nombre.toUpperCase();
    document.getElementById('batalla-p1-imagen').src = pokemonBatalla1.imagen || 'profesor.svg';
    document.getElementById('batalla-p1-hp').textContent = pokemonBatalla1.hp;
    document.getElementById('batalla-p1-atk').textContent = pokemonBatalla1.ataque;
    document.getElementById('batalla-p1-def').textContent = pokemonBatalla1.defensa;
    document.getElementById('batalla-p1-vel').textContent = pokemonBatalla1.velocidad;

    // Pokémon 2
    document.getElementById('batalla-p2-nombre').textContent = pokemonBatalla2.nombre.toUpperCase();
    document.getElementById('batalla-p2-imagen').src = pokemonBatalla2.imagen || 'profesor.svg';
    document.getElementById('batalla-p2-hp').textContent = pokemonBatalla2.hp;
    document.getElementById('batalla-p2-atk').textContent = pokemonBatalla2.ataque;
    document.getElementById('batalla-p2-def').textContent = pokemonBatalla2.defensa;
    document.getElementById('batalla-p2-vel').textContent = pokemonBatalla2.velocidad;

    // Ocultar resultado
    document.getElementById('batalla-resultado').style.display = 'none';
    document.getElementById('btn-iniciar-batalla').style.display = 'inline-block';
}

// Iniciar batalla y calcular ganador
function iniciarBatalla() {
    if (!pokemonBatalla1 || !pokemonBatalla2) return;

    // Calcular puntuación de batalla basada en stats
    const poder1 = (pokemonBatalla1.hp * 0.2) + 
                   (pokemonBatalla1.ataque * 0.35) + 
                   (pokemonBatalla1.defensa * 0.2) + 
                   (pokemonBatalla1.velocidad * 0.25);

    const poder2 = (pokemonBatalla2.hp * 0.2) + 
                   (pokemonBatalla2.ataque * 0.35) + 
                   (pokemonBatalla2.defensa * 0.2) + 
                   (pokemonBatalla2.velocidad * 0.25);

    // Agregar algo de aleatoriedad (15%)
    const poder1Random = poder1 * (0.85 + Math.random() * 0.3);
    const poder2Random = poder2 * (0.85 + Math.random() * 0.3);

    let resultadoTexto;
    if (poder1Random > poder2Random) {
        resultadoTexto = `🏆 ¡${pokemonBatalla1.nombre.toUpperCase()} GANA LA BATALLA! 🏆`;
    } else if (poder2Random > poder1Random) {
        resultadoTexto = `🏆 ¡${pokemonBatalla2.nombre.toUpperCase()} GANA LA BATALLA! 🏆`;
    } else {
        resultadoTexto = `⚔️ ¡ES UN EMPATE! ⚔️`;
    }

    document.getElementById('resultado-texto').textContent = resultadoTexto;
    document.getElementById('batalla-resultado').style.display = 'block';
    document.getElementById('btn-iniciar-batalla').style.display = 'none';
}

// Cerrar modal de batalla
function cerrarBatalla() {
    document.getElementById('modal-batalla').style.display = 'none';
    pokemonBatalla1 = null;
    pokemonBatalla2 = null;
}

// Inicializar: cargar pokémon #1 y actualizar tabla
window.addEventListener('DOMContentLoaded', function() {
    obtenerPokemon(1);
    actualizarTabla();
});
