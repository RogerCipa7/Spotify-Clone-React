<div align="center">

<img src="./public/music-icon.svg" width="90" height="90" alt="Spotify Clone Logo" />

# 🎵 Spotify Clone 2025

### *Un clon de Spotify de alto rendimiento enfocado en la música mexicana contemporánea.*

<br/>

[![Ver en Vivo](https://img.shields.io/badge/🚀_VER_PROYECTO_EN_VIVO-1DB954?style=for-the-badge&logoColor=white)](https://spotify-clone-react-liard.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-RogerCipa7-181717?style=for-the-badge&logo=github)](https://github.com/RogerCipa7)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Roger_Cipagauta-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/roger-cipagauta-b1626b329/)

<br/>

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat-square&logo=react&logoColor=white)

</div>

---

## ✨ ¿Qué es este proyecto?

No es solo una interfaz. Es una **aplicación funcional completa** que consume datos reales de la iTunes Search API, permite escuchar previews de 30 segundos, guardar favoritos y navegar entre playlists en una experiencia premium y totalmente responsiva.

Especializado en la escena de música mexicana contemporánea:

> 🤠 Corridos Tumbados · 🔫 Corridos Bélicos · 🎻 Regional Mexicano

Artistas como **Peso Pluma**, **Natanael Cano**, **Fuerza Regida**, **Junior H**, **Tito Double P**, **Víctor Mendívil** y muchos más.

---

## 🌟 Características Principales

| Característica | Descripción |
|---|---|
| 🎧 **Reproducción Real** | Previews oficiales de 30s vía iTunes Search API |
| ❤️ **Sistema de Favoritos** | Persistencia en `localStorage`, página dedicada `/misfavoritos` |
| 📱 **Totalmente Responsive** | Mobile-first, sidebar hamburguesa, adaptación fluida |
| 🎨 **UI Premium** | Gradientes dinámicos, micro-animaciones, modo oscuro/claro |
| ⚡ **SPA Ultrarrápida** | Navegación instantánea sin recarga con React Router |
| 🔀 **Cola Inteligente** | Shuffle, Repeat, Siguiente, Anterior sobre playlist completa |

---

## 🛠️ Stack Tecnológico

```
React 18 + Vite       →  Interfaz reactiva y builds ultrarrápidos
TypeScript            →  Tipado estático, código robusto y escalable
Tailwind CSS          →  Diseño moderno, flexible y 100% responsivo
Zustand               →  Estado global del reproductor sin prop drilling
React Router Dom      →  Navegación SPA entre páginas
Lucide React          →  Iconos vectoriales minimalistas
iTunes Search API     →  Carátulas, artistas y previews de audio reales
```

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/        # Componentes reutilizables
│   ├── Card.tsx       # Tarjeta de playlist con hover y botón play
│   ├── Player.tsx     # Reproductor fijo inferior con audio HTML5
│   ├── Sidebar.tsx    # Navegación lateral + biblioteca de playlists
│   └── Header.tsx     # Barra superior con perfil y toggle de tema
│
├── pages/             # Vistas principales
│   ├── Home.tsx       # Inicio con secciones "Para Ti" y "Explorar"
│   ├── Playlist.tsx   # Vista de playlist con lista de canciones
│   ├── Search.tsx     # Búsqueda por artista o género
│   ├── Library.tsx    # Biblioteca personal del usuario
│   └── Favorites.tsx  # Canciones marcadas con ❤️
│
├── store/
│   └── usePlayerStore.ts   # Zustand: reproductor, tema, favoritos, sidebar
│
└── services/
    └── api.ts         # iTunes API: búsqueda, cache y fallback de playlists
```

---

## 🔊 Motor de Audio

El reproductor usa el elemento `<audio>` nativo de HTML5 con control total desde Zustand:

- ✅ **Play / Pause** con estado sincronizado globalmente
- ✅ **Barra de progreso interactiva** — click en cualquier punto para saltar
- ✅ **Control de volumen** con botón de silencio
- ✅ **Shuffle** — orden aleatorio de la cola
- ✅ **Repeat** — repetir canción o lista
- ✅ **Autoplay** al siguiente track al finalizar
- ✅ **Carga lazy** con indicador de spinner mientras bufferiza

---

## ❤️ Sistema de Favoritos

```
Usuario le da ❤️ a una canción
        ↓
Se guarda en localStorage (persiste al cerrar)
        ↓
Aparece en /misfavoritos con reproducción directa
        ↓
Contador reactivo visible en Sidebar y Library
```

---

## 🎨 Experiencia Visual

### Modo Oscuro / Claro
Implementado con **CSS Custom Properties** — cambio instantáneo en tiempo real sin recargar.

```css
var(--bg-primary)      /* Fondo principal */
var(--text-primary)    /* Texto principal */
var(--spotify-green)   /* Acento verde #1DB954 */
var(--bg-elevated)     /* Cards y elementos elevados */
```

### Animaciones y Micro-interacciones
- Botón de play aparece con **spring bounce** al hover en las cards
- Portada de la canción activa con **glow verde** y borde pulsante
- Sidebar con **indicador lateral verde** en la ruta activa
- Dropdown de perfil con **animación scale + translateY**
- Quick picks con `hover:-translate-y-1` y sombra profunda

---

## 🚀 Instalación y Uso

```bash
# 1. Clonar el repositorio
git clone https://github.com/RogerCipa7/Spotify-Clone-React.git

# 2. Entrar al proyecto
cd Spotify-Clone-React

# 3. Instalar dependencias
npm install

# 4. Ejecutar en modo desarrollo
npm run dev

# 5. Build de producción
npm run build
```

> La app corre en `http://localhost:5173` por defecto.

---

## 🎯 Lo que demuestra este proyecto

- ✅ Arquitectura SPA profesional y modular
- ✅ Manejo avanzado del elemento `<audio>` con estado global
- ✅ Consumo de APIs externas con cache y fallback
- ✅ Persistencia de datos con `localStorage`
- ✅ Diseño responsive mobile-first con Tailwind CSS
- ✅ TypeScript aplicado en componentes, stores y servicios
- ✅ Micro-animaciones y UX de nivel producción

---

## 👨‍💻 Autor

<div align="center">

**Roger Cipagauta** · Frontend Developer · 2025

[![GitHub](https://img.shields.io/badge/github.com/RogerCipa7-181717?style=for-the-badge&logo=github)](https://github.com/RogerCipa7)
[![LinkedIn](https://img.shields.io/badge/Roger_Cipagauta-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/roger-cipagauta-b1626b329/)

<br/>



</div>
