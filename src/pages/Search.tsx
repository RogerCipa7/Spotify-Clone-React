// ============================================
// Página Search - Buscador
// Creado por Roger Cipagauta
// ============================================

import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, Play, Pause, Loader } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import type { Track } from '../store/usePlayerStore';

// Mismo conversor que en api.ts (copiado para búsqueda directa)
interface iTunesResult {
    trackId: number;
    trackName: string;
    artistName: string;
    collectionName: string;
    artworkUrl100: string;
    previewUrl: string;
    trackTimeMillis: number;
}

function formatearDuracion(segundos: number): string {
    const m = Math.floor(segundos / 60);
    const s = Math.floor(segundos % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Search() {
    const [query, setQuery] = useState('');
    const [resultados, setResultados] = useState<Track[]>([]);
    const [cargando, setCargando] = useState(false);
    const { currentTrack, isPlaying, togglePlay, playFromPlaylist } = usePlayerStore();
    const timeoutRef = useRef<number | null>(null);

    // Buscar en iTunes al escribir (con debounce)
    useEffect(() => {
        if (query.trim().length === 0) {
            setResultados([]);
            return;
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = window.setTimeout(async () => {
            setCargando(true);
            try {
                const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=25&country=MX&lang=es_mx`;
                const res = await fetch(url);
                const data = await res.json();
                const tracks: Track[] = data.results
                    .filter((item: iTunesResult) => item.previewUrl && item.trackName)
                    .map((item: iTunesResult) => ({
                        id: `search-${item.trackId}`,
                        title: item.trackName,
                        artist: item.artistName,
                        album: item.collectionName || 'Sencillo',
                        cover: item.artworkUrl100.replace('100x100', '600x600'),
                        duration: Math.floor((item.trackTimeMillis || 30000) / 1000),
                        previewUrl: item.previewUrl,
                    }));
                setResultados(tracks);
            } catch (error) {
                console.error('Error en búsqueda:', error);
            } finally {
                setCargando(false);
            }
        }, 600); // 600ms debounce

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [query]);

    const estaReproduciendo = (track: Track) =>
        currentTrack?.id === track.id && isPlaying;

    const alHacerClicEnTrack = (index: number) => {
        const track = resultados[index];
        if (currentTrack?.id === track.id) {
            togglePlay();
        } else {
            playFromPlaylist(resultados, index);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-24 pt-4">
            {/* Barra de búsqueda */}
            <div className="relative max-w-2xl mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon size={20} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="¿Qué quieres escuchar? (ej: Peso Pluma, corridos...)"
                    className="block w-full pl-10 pr-3 py-3 rounded-full outline-none transition-all duration-300 shadow-md focus:shadow-lg focus:scale-[1.01]"
                    style={{
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                    }}
                />
                {cargando && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Loader size={18} className="animate-spin text-spotify-green" />
                    </div>
                )}
            </div>

            {/* Resultados */}
            {query.trim().length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                        Resultados principales
                    </h2>

                    <div className="mt-1">
                        {resultados.length === 0 && !cargando && (
                            <p className="py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                No se encontraron canciones para "{query}"
                            </p>
                        )}

                        {resultados.map((track, index) => {
                            const activo = currentTrack?.id === track.id;
                            const reproduciendo = estaReproduciendo(track);

                            return (
                                <button
                                    key={`res-${track.id}`}
                                    onClick={() => alHacerClicEnTrack(index)}
                                    className="w-full grid grid-cols-[16px_1fr_1fr_minmax(50px,auto)] sm:grid-cols-[40px_1fr_1fr_100px] gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-2.5 rounded-md transition-all duration-150 group text-left"
                                    style={{
                                        backgroundColor: activo ? 'var(--bg-quick-pick)' : 'transparent',
                                    }}
                                    onMouseEnter={(e) => { if (!activo) e.currentTarget.style.backgroundColor = 'var(--bg-quick-pick)'; }}
                                    onMouseLeave={(e) => { if (!activo) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
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
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                        <img
                                            src={track.cover}
                                            alt={track.title}
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded object-cover flex-shrink-0"
                                            loading="lazy"
                                        />
                                        <div className="min-w-0">
                                            <p className={`text-xs sm:text-sm font-medium truncate ${activo ? 'text-spotify-green' : ''}`} style={!activo ? { color: 'var(--text-primary)' } : undefined}>
                                                {track.title}
                                            </p>
                                            <p className="text-[10px] sm:text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                                                {track.artist}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs sm:text-sm truncate items-center hidden sm:flex" style={{ color: 'var(--text-secondary)' }}>
                                        {track.album}
                                    </span>
                                    <span className="text-xs sm:text-sm flex items-center justify-end tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                                        {formatearDuracion(track.duration)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
