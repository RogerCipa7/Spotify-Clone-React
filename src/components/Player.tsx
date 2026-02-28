// ============================================
// Componente Player - Reproductor Inferior Fijo
// Creado por Roger Cipagauta 2025
// ============================================
// Reproductor con audio real HTML5, controles
// completos, barra de progreso interactiva,
// volumen y navegación entre canciones.
// ============================================

import {
    Play, Pause, SkipBack, SkipForward,
    Shuffle, Repeat, Volume2, VolumeX, Loader, Heart
} from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

// Formatear segundos a formato mm:ss
function formatearTiempo(segundos: number): string {
    const m = Math.floor(segundos / 60);
    const s = Math.floor(segundos % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Player() {
    const {
        currentTrack, isPlaying, progress, currentTime, volume,
        shuffle, repeat, isLoading,
        togglePlay, seekTo, nextTrack, prevTrack,
        setVolume, toggleShuffle, toggleRepeat,
        toggleFavorite, isFavorite
    } = usePlayerStore();

    // Manejar clic en la barra de progreso para saltar
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const barraProgreso = e.currentTarget;
        const rect = barraProgreso.getBoundingClientRect();
        const porcentaje = ((e.clientX - rect.left) / rect.width) * 100;
        seekTo(Math.max(0, Math.min(100, porcentaje)));
    };

    // Calcular tiempos
    const tiempoActual = currentTime;
    const duracionTotal = currentTrack?.duration ?? 0;

    return (
        <footer
            className="fixed bottom-0 left-0 right-0 z-50 h-[72px] sm:h-[80px] flex items-center px-2 sm:px-4 transition-colors duration-300"
            style={{ backgroundColor: 'var(--bg-player)', borderTop: '1px solid var(--border-subtle)' }}
        >
            {/* Izquierda: Info de la canción actual */}
            <div className="flex items-center gap-2 sm:gap-3 w-[30%] min-w-0">
                {currentTrack ? (
                    <>
                        <img
                            src={currentTrack.cover}
                            alt={currentTrack.title}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded object-cover shadow-md flex-shrink-0 ${isPlaying ? 'animate-pulse-slow' : ''}`}
                        />
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-semibold truncate hover:underline cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                                {currentTrack.title}
                            </p>
                            <p className="text-[10px] sm:text-xs truncate hover:underline cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                                {currentTrack.artist}
                            </p>
                        </div>
                        <button
                            onClick={() => toggleFavorite(currentTrack)}
                            className={`ml-2 sm:ml-4 transition-all duration-200 hover:scale-110 flex-shrink-0 ${isFavorite(currentTrack.id) ? 'text-spotify-green' : 'text-secondary hover:text-primary'
                                }`}
                            aria-label={isFavorite(currentTrack.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        >
                            <Heart
                                size={18}
                                className={isFavorite(currentTrack.id) ? 'fill-spotify-green' : ''}
                            />
                        </button>
                    </>
                ) : (
                    <div className="min-w-0">
                        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Selecciona una canción
                        </p>
                    </div>
                )}
            </div>

            {/* Centro: Controles y barra de progreso */}
            <div className="flex-1 flex flex-col items-center justify-center gap-1 max-w-[600px] mx-auto">
                {/* Botones de control */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Shuffle / Aleatorio */}
                    <button
                        onClick={toggleShuffle}
                        className={`p-1 transition-all duration-200 hover:scale-110 hidden sm:block ${shuffle ? 'text-spotify-green' : ''
                            }`}
                        style={!shuffle ? { color: 'var(--text-secondary)' } : undefined}
                        aria-label="Aleatorio"
                        title="Aleatorio"
                    >
                        <Shuffle size={16} />
                    </button>

                    {/* Anterior */}
                    <button
                        onClick={prevTrack}
                        className="transition-all duration-200 hover:scale-110 p-1"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label="Anterior"
                        title="Anterior"
                    >
                        <SkipBack size={18} className="fill-current" />
                    </button>

                    {/* Play / Pause */}
                    <button
                        onClick={togglePlay}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg"
                        style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-main)' }}
                        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                        title={isPlaying ? 'Pausar' : 'Reproducir'}
                    >
                        {isLoading ? (
                            <Loader size={16} className="animate-spin" />
                        ) : isPlaying ? (
                            <Pause size={16} className="fill-current" />
                        ) : (
                            <Play size={16} className="fill-current ml-0.5" />
                        )}
                    </button>

                    {/* Siguiente */}
                    <button
                        onClick={nextTrack}
                        className="transition-all duration-200 hover:scale-110 p-1"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label="Siguiente"
                        title="Siguiente"
                    >
                        <SkipForward size={18} className="fill-current" />
                    </button>

                    {/* Repetir */}
                    <button
                        onClick={toggleRepeat}
                        className={`p-1 transition-all duration-200 hover:scale-110 hidden sm:block ${repeat ? 'text-spotify-green' : ''
                            }`}
                        style={!repeat ? { color: 'var(--text-secondary)' } : undefined}
                        aria-label="Repetir"
                        title="Repetir"
                    >
                        <Repeat size={16} />
                    </button>
                </div>

                {/* Barra de progreso */}
                <div className="w-full flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-8 sm:w-10 text-right tabular-nums">{formatearTiempo(tiempoActual)}</span>
                    <div
                        onClick={handleProgressClick}
                        className="flex-1 h-1 rounded-full cursor-pointer group relative hover:h-1.5 transition-all duration-150"
                        style={{ backgroundColor: 'var(--bg-progress)' }}
                    >
                        <div
                            className="h-full group-hover:bg-spotify-green rounded-full transition-colors duration-200 relative"
                            style={{ width: `${progress}%`, backgroundColor: 'var(--text-primary)' }}
                        >
                            <div
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                style={{ backgroundColor: 'var(--text-primary)' }}
                            />
                        </div>
                    </div>
                    <span className="w-8 sm:w-10 tabular-nums">{formatearTiempo(duracionTotal)}</span>
                </div>
            </div>

            {/* Derecha: Volumen */}
            <div className="w-[30%] flex items-center justify-end gap-2">
                <button
                    onClick={() => setVolume(volume > 0 ? 0 : 75)}
                    className="transition-colors hidden sm:block"
                    style={{ color: 'var(--text-secondary)' }}
                    aria-label={volume > 0 ? 'Silenciar' : 'Activar sonido'}
                    title={volume > 0 ? 'Silenciar' : 'Activar sonido'}
                >
                    {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-16 sm:w-24 accent-spotify-green hidden sm:block"
                    aria-label="Volumen"
                    title={`Volumen: ${volume}%`}
                />
            </div>
        </footer>
    );
}
