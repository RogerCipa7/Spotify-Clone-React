// ============================================
// Página Home - Inicio Principal
// Creado por Roger Cipagauta 2025
// ============================================
// Muestra playlists de corridos tumbados,
// bélicos y regional mexicano con datos reales
// de la iTunes Search API.
// ============================================

import { useState, useEffect } from 'react';
import Card from '../components/Card';
import { cargarTodasLasPlaylists, obtenerPlaylistsFallback } from '../services/api';
import { usePlayerStore } from '../store/usePlayerStore';
import { Play, Loader, ChevronRight } from 'lucide-react';
import type { Playlist } from '../services/api';

// Saludo según la hora del día
function obtenerSaludo(nombre: string = "RogerCipa7"): string {
    const hora = new Date().getHours();
    let saludo: string;
    if (hora < 12) {
        saludo = "Buenos días";
    } else if (hora < 18) {
        saludo = "Buenas tardes";
    } else {
        saludo = "Buenas noches";
    }
    return `${saludo}, ${nombre}`;
}

// IDs exactos para la sección "Para Ti"
const PARA_TI_IDS = [
    'victor-mendivil',
    'peso-pluma',
    'tito-double-p',
    'darlles-de-la-sierra',
    'natanael-cano',
    'junior-h',
    'armenta',
    'clave-especial',
];

// IDs para "Playlists Populares"
const POPULARES_IDS = [
    'corridos-tumbados',
    'corridos-belicos',
    'fuerza-regida',
    'herencia-de-patrones',
    'los-dos-carnales',
    'legado-7',
];

export default function Home() {
    const { playFromPlaylist } = usePlayerStore();
    const [playlists, setPlaylists] = useState<Playlist[]>(obtenerPlaylistsFallback());
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarTodasLasPlaylists()
            .then((data) => {
                if (data.length > 0) setPlaylists(data);
            })
            .finally(() => setCargando(false));
    }, []);

    // Selección rápida: primeras 6
    const destacadas = playlists.slice(0, 6);

    // Para Ti: artistas fijos en orden
    const paraT = PARA_TI_IDS
        .map((id) => playlists.find((p) => p.id === id))
        .filter(Boolean) as Playlist[];

    // Populares: artistas fijos
    const populares = POPULARES_IDS
        .map((id) => playlists.find((p) => p.id === id))
        .filter(Boolean) as Playlist[];

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-28 space-y-8">

            {/* ── Encabezado ──────────────────────────────────────────────── */}
            <div className="pt-2">
                <h1
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {obtenerSaludo()}
                </h1>
            </div>

            {/* ── Cargando ────────────────────────────────────────────────── */}
            {cargando && (
                <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl w-fit"
                    style={{ backgroundColor: 'var(--bg-card)' }}
                >
                    <Loader size={18} className="animate-spin text-spotify-green flex-shrink-0" />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Cargando playlists...
                    </span>
                </div>
            )}

            {/* ── Selección rápida ────────────────────────────────────────── */}
            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    {destacadas.map((playlist) => (
                        <button
                            key={playlist.id}
                            onClick={() => {
                                if (playlist.tracks.length > 0) {
                                    playFromPlaylist(playlist.tracks, 0);
                                }
                            }}
                            className="flex items-center rounded-lg overflow-hidden transition-all duration-200 group theme-bg-quick-pick-hover hover:brightness-125 hover:-translate-y-0.5 active:scale-[0.98]"
                            style={{ backgroundColor: 'var(--bg-quick-pick)' }}
                        >
                            <img
                                src={playlist.cover}
                                alt={playlist.title}
                                className="w-14 h-14 sm:w-16 sm:h-16 object-cover flex-shrink-0"
                                loading="lazy"
                            />
                            <span
                                className="text-xs sm:text-sm font-bold px-3 sm:px-4 truncate flex-1 text-left"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                {playlist.title}
                            </span>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-spotify-green rounded-full items-center justify-center mr-3 shadow-lg shadow-black/40 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 hidden sm:flex flex-shrink-0">
                                <Play size={15} className="text-black fill-black ml-0.5" />
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Para Ti ─────────────────────────────────────────────────── */}
            <section>
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <h2
                        className="text-xl sm:text-2xl font-bold tracking-tight hover:underline cursor-pointer"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Para Ti
                    </h2>
                    <button
                        className="flex items-center gap-1 text-xs sm:text-sm font-bold hover:underline uppercase tracking-wider transition-colors duration-200 hover:text-spotify-green"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Mostrar todo
                        <ChevronRight size={15} />
                    </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                    {paraT.map((playlist) => (
                        <Card key={playlist.id} playlist={playlist} />
                    ))}
                </div>
            </section>

            {/* ── Playlists Populares ─────────────────────────────────────── */}
            <section>
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <h2
                        className="text-xl sm:text-2xl font-bold tracking-tight hover:underline cursor-pointer"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Playlists Populares
                    </h2>
                    <button
                        className="flex items-center gap-1 text-xs sm:text-sm font-bold hover:underline uppercase tracking-wider transition-colors duration-200 hover:text-spotify-green"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Mostrar todo
                        <ChevronRight size={15} />
                    </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                    {populares.map((playlist) => (
                        <Card key={playlist.id} playlist={playlist} />
                    ))}
                </div>
            </section>

            {/* ── Explorar Todo ───────────────────────────────────────────── */}
            <section>
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <h2
                        className="text-xl sm:text-2xl font-bold tracking-tight hover:underline cursor-pointer"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Explorar Todo
                    </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                    {playlists.map((playlist) => (
                        <Card key={playlist.id} playlist={playlist} />
                    ))}
                </div>
            </section>

        </div>
    );
}