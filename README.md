# Pokedex

Una Pokédex interactiva estilo Game Boy que utiliza la API de PokéAPI para mostrar información de Pokémon.

## Características

- 🎮 Interfaz estilo Game Boy clásico
- 🔍 Búsqueda de Pokémon por número o nombre
- ➕ Agregar Pokémon favoritos a una lista
- ✏️ Editar y eliminar Pokémon de la lista
- 📊 Mostrar estadísticas: HP, Ataque, Defensa, Velocidad
- 🎨 Visualización de tipos con iconos
- 💾 Persistencia de datos con localStorage

## Tecnologías

- HTML5
- CSS3
- JavaScript (Vanilla)
- PokéAPI (https://pokeapi.co/)
- Materialize Framework

## Cómo usar

1. Abre `index.html` en tu navegador
2. Usa los números para ingresar el ID del Pokémon
3. Presiona "Buscar" para encontrarlo
4. Usa las flechas para navegar entre Pokémon
5. Presiona "Agregar" para guardar a tu lista
6. Accede a tu lista desde el botón "Pokémon Capturados" en la esquina superior derecha

## Estructura del proyecto

```
pokedex/
├── index.html          # Página principal
├── style.css           # Estilos personalizados
├── general.js          # Lógica de la aplicación
├── profesor.svg        # Imagen del profesor Pokémon
├── css/
│   ├── materialize.css
│   └── materialize.min.css
├── js/
│   ├── materialize.js
│   └── materialize.min.js
└── tipos/
    └── Tipo_*.png      # Imágenes de tipos Pokémon
```

## Autor

JafetICM

## Licencia

MIT
