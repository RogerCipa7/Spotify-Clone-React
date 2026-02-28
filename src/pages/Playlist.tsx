// ============================================
// Página Playlist - Vista de Detalle
// Creado por Roger Cipagauta
// ============================================
// Muestra la lista de canciones de una playlist
// con portada grande, info, y lista de tracks
// reproducibles con audio real.
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Clock, ArrowLeft, Loader, Heart } from 'lucide-react';
import { obtenerPlaylistPorId } from '../services/api';
import { usePlayerStore } from '../store/usePlayerStore';
import type { Track } from '../store/usePlayerStore';
import type { Playlist as PlaylistType } from '../services/api';

// Formatear duración en mm:ss
function formatearDuracion(segundos: number): string {
    const m = Math.floor(segundos / 60);
    const s = Math.floor(segundos % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Playlist() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentTrack, isPlaying, playFromPlaylist, togglePlay } = usePlayerStore();

    const [playlist, setPlaylist] = useState<PlaylistType | null>(null);
    const [cargando, setCargando] = useState(true);

    // Cargar playlist real desde la API
    useEffect(() => {
        if (!id) return;
        setCargando(true);
        obtenerPlaylistPorId(id)
            .then((data) => {
                if (data) setPlaylist(data);
            })
            .finally(() => setCargando(false));
    }, [id]);

    // Estado de carga
    if (cargando) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader size={40} className="animate-spin text-spotify-green" />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Cargando playlist...</p>
            </div>
        );
    }

    // Playlist no encontrada
    if (!playlist) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <p className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Playlist no encontrada</p>
                <button
                    onClick={() => navigate('/')}
                    className="text-spotify-green hover:underline flex items-center gap-2"
                >
                    <ArrowLeft size={16} /> Volver al inicio
                </button>
            </div>
        );
    }

    // Verificar si un track se está reproduciendo
    const estaReproduciendo = (track: Track) =>
        currentTrack?.id === track.id && isPlaying;

    // Manejar clic en un track
    const alHacerClicEnTrack = (index: number) => {
        const track = playlist.tracks[index];
        if (currentTrack?.id === track.id) {
            togglePlay();
        } else {
            // Reproducir desde la playlist completa (para que next/prev funcione)
            playFromPlaylist(playlist.tracks, index);
        }
    };

    // Calcular duración total
    const duracionTotal = playlist.tracks.reduce((acc, t) => acc + t.duration, 0);
    const minutosTotal = Math.floor(duracionTotal / 60);

    return (
        <div className="pb-24">
            {/* Encabezado de la playlist */}
            <div className="relative px-4 sm:px-6 lg:px-8 pt-4 pb-6 sm:pb-8">
                {/* Fondo con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-purple-900/30 to-transparent" />

                <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                    {/* Portada grande */}
                    <img
                        src={playlist.cover}
                        alt={playlist.title}
                        className="w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-lg object-cover flex-shrink-0"
                        style={{ boxShadow: `0 16px 48px var(--shadow-color)` }}
                    />

                    {/* Información */}
                    <div className="text-center sm:text-left flex flex-col gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                            Playlist
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-extrabold leading-tight" style={{ color: 'var(--text-primary)' }}>
                            {playlist.title}
                        </h1>
                        <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>{playlist.description}</p>
                        <div className="flex items-center gap-1 text-xs sm:text-sm justify-center sm:justify-start flex-wrap" style={{ color: 'var(--text-secondary)' }}>
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Roger Cipagauta</span>
                            <span>•</span>
                            <span>{playlist.tracks.length} canciones</span>
                            <span>•</span>
                            <span>aprox. {minutosTotal} min</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón de reproducir todo */}
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4 sm:gap-6">
                <button
                    onClick={() => {
                        if (playlist.tracks.length > 0) {
                            playFromPlaylist(playlist.tracks, 0);
                        }
                    }}
                    className="w-12 h-12 sm:w-14 sm:h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 hover:bg-spotify-green-light active:scale-95 transition-all duration-200 shadow-xl"
                    aria-label="Reproducir todo"
                    title="Reproducir todo"
                >
                    <Play size={22} className="text-black fill-black ml-1" />
                </button>
            </div>

            {/* Lista de canciones */}
            <div className="px-2 sm:px-4 lg:px-8">
                {/* Encabezado de la tabla */}
                <div
                    className="grid grid-cols-[16px_1fr_1fr_minmax(50px,auto)] sm:grid-cols-[40px_1fr_1fr_100px] gap-2 sm:gap-4 px-2 sm:px-4 py-2 text-xs uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
                >
                    <span className="text-center">#</span>
                    <span>Título</span>
                    <span className="hidden sm:block">Álbum</span>
                    <span className="flex justify-end items-center">
                        <Clock size={14} />
                    </span>
                </div>

                {/* Canciones */}
                <div className="mt-1">
                    {playlist.tracks.length === 0 && (
                        <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                            <p className="text-sm">No se encontraron canciones en esta playlist</p>
                        </div>
                    )}

                    {playlist.tracks.map((track, index) => {
                        const activo = currentTrack?.id === track.id;
                        const reproduciendo = estaReproduciendo(track);

                        return (
                            <button
                                key={track.id}
                                onClick={() => alHacerClicEnTrack(index)}
                                className="w-full grid grid-cols-[16px_1fr_1fr_minmax(50px,auto)] sm:grid-cols-[40px_1fr_1fr_100px] gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-2.5 rounded-md transition-all duration-150 group text-left"
                                style={{
                                    backgroundColor: activo ? 'var(--bg-quick-pick)' : 'transparent',
                                }}
                                onMouseEnter={(e) => { if (!activo) e.currentTarget.style.backgroundColor = 'var(--bg-quick-pick)'; }}
                                onMouseLeave={(e) => { if (!activo) e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                                {/* Número / Ícono de reproducción */}
                                <span className="flex items-center justify-center">
                                    {activo ? (
                                        reproduciendo ? (
                                            <Pause size={14} className="text-spotify-green" />
                                        ) : (
                                            <Play size={14} className="text-spotify-green fill-spotify-green" />
                                        )
                                    ) : (
                                        <>
                                            <span className="text-sm group-hover:hidden" style={{ color: 'var(--text-secondary)' }}>
                                                {index + 1}
                                            </span>
                                            <Play size={14} className="hidden group-hover:block" style={{ color: 'var(--text-primary)' }} />
                                        </>
                                    )}
                                </span>

                                {/* Título + Artista */}
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <img
                                        src={track.cover}
                                        alt={track.title}
                                        className="w-9 h-9 sm:w-10 sm:h-10 rounded object-cover flex-shrink-0"
                                        loading="lazy"
                                    />
                                    <div className="min-w-0">
                                        <p className={`text-xs sm:text-sm font-medium truncate ${activo ? 'text-spotify-green' : ''
                                            }`} style={!activo ? { color: 'var(--text-primary)' } : undefined}>
                                            {track.title}
                                        </p>
                                        <p className="text-[10px] sm:text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                                            {track.artist}
                                        </p>
                                    </div>
                                </div>

                                {/* Álbum */}
                                <span className="text-xs sm:text-sm truncate items-center hidden sm:flex" style={{ color: 'var(--text-secondary)' }}>
                                    {track.album}
                                </span>

                                {/* Duración y Favorito */}
                                <div className="flex items-center justify-end gap-3 sm:gap-4 pr-1 sm:pr-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            usePlayerStore.getState().toggleFavorite(track);
                                        }}
                                        className={`transition-all duration-200 hover:scale-110 ${usePlayerStore.getState().isFavorite(track.id)
                                            ? 'text-spotify-green opacity-100'
                                            : 'text-secondary opacity-0 group-hover:opacity-100'
                                            }`}
                                    >
                                        <Heart
                                            size={16}
                                            className={usePlayerStore.getState().isFavorite(track.id) ? 'fill-spotify-green' : ''}
                                        />
                                    </button>
                                    <span className="text-xs sm:text-sm tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                                        {formatearDuracion(track.duration)}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Crédito */}
            <div className="px-4 sm:px-6 lg:px-8 mt-8 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                    Creado por <span className="font-semibold text-spotify-green">Roger Cipagauta</span>
                </p>
            </div>
        </div>
    );
}
