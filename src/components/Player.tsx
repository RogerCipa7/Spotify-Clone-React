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

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const porcentaje = ((e.clientX - rect.left) / rect.width) * 100;
        seekTo(Math.max(0, Math.min(100, porcentaje)));
    };

    const tiempoActual = currentTime;
    const duracionTotal = currentTrack?.duration ?? 0;
    const favorito = currentTrack ? isFavorite(currentTrack.id) : false;

    return (
        <footer
            className="fixed bottom-0 left-0 right-0 z-50 transition-colors duration-300"
            style={{
                backgroundColor: 'var(--bg-player)',
                borderTop: '1px solid var(--border-subtle)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
            }}
        >
            {/* ── Layout principal ── */}
            <div className="flex items-center h-[72px] sm:h-[80px] px-3 sm:px-6 gap-2 sm:gap-4">

                {/* ── IZQUIERDA: portada + info + corazón ── */}
                {/* En móvil: ocupa lo mínimo necesario. En desktop: 30% */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0 w-auto sm:w-[30%]">
                    {currentTrack ? (
                        <>
                            {/* Portada */}
                            <div className="relative flex-shrink-0">
                                <img
                                    src={currentTrack.cover}
                                    alt={currentTrack.title}
                                    className={`w-10 h-10 sm:w-14 sm:h-14 rounded-md object-cover shadow-lg transition-all duration-300 ${isPlaying ? 'shadow-spotify-green/20 scale-[1.03]' : ''}`}
                                    style={{ boxShadow: isPlaying ? '0 0 14px rgba(29,185,84,0.25)' : undefined }}
                                />
                                {isPlaying && (
                                    <div className="absolute inset-0 rounded-md border border-spotify-green/40 animate-pulse pointer-events-none" />
                                )}
                            </div>

                            {/* Texto: solo visible en sm+ */}
                            <div className="min-w-0 hidden sm:block">
                                <p className="text-sm font-semibold truncate hover:underline cursor-pointer leading-tight" style={{ color: 'var(--text-primary)' }}>
                                    {currentTrack.title}
                                </p>
                                <p className="text-xs truncate hover:underline cursor-pointer mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                    {currentTrack.artist}
                                </p>
                            </div>

                            {/* Corazón */}
                            <button
                                onClick={() => toggleFavorite(currentTrack)}
                                className={`flex-shrink-0 transition-all duration-200 hover:scale-125 active:scale-90 p-1 rounded-full ${favorito ? 'text-spotify-green' : ''}`}
                                style={!favorito ? { color: 'var(--text-secondary)' } : undefined}
                                aria-label={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                title={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            >
                                <Heart
                                    size={17}
                                    className={favorito ? 'fill-spotify-green' : ''}
                                />
                            </button>
                        </>
                    ) : (
                        <p className="text-xs sm:text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                            Selecciona una canción
                        </p>
                    )}
                </div>

                {/* ── CENTRO: controles + progreso (flex-1 para que tome todo el espacio restante) ── */}
                <div className="flex-1 flex flex-col items-center justify-center gap-1 min-w-0">

                    {/* Botones */}
                    <div className="flex items-center gap-3 sm:gap-5">
                        {/* Shuffle — solo desktop */}
                        <button
                            onClick={toggleShuffle}
                            className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 hidden sm:flex items-center justify-center relative ${shuffle ? 'text-spotify-green' : ''}`}
                            style={!shuffle ? { color: 'var(--text-secondary)' } : undefined}
                            aria-label="Aleatorio"
                            title="Aleatorio"
                        >
                            <Shuffle size={16} />
                            {shuffle && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-spotify-green" />}
                        </button>

                        {/* Anterior */}
                        <button
                            onClick={prevTrack}
                            className="p-1.5 transition-all duration-200 hover:scale-110 active:scale-90"
                            style={{ color: 'var(--text-secondary)' }}
                            aria-label="Anterior"
                            title="Anterior"
                        >
                            <SkipBack size={18} className="fill-current" />
                        </button>

                        {/* Play / Pause */}
                        <button
                            onClick={togglePlay}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
                            style={{
                                backgroundColor: 'var(--text-primary)',
                                color: 'var(--bg-main)',
                                boxShadow: isPlaying ? '0 0 18px rgba(29,185,84,0.3)' : undefined,
                            }}
                            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                            title={isPlaying ? 'Pausar' : 'Reproducir'}
                        >
                            {isLoading ? (
                                <Loader size={17} className="animate-spin" />
                            ) : isPlaying ? (
                                <Pause size={17} className="fill-current" />
                            ) : (
                                <Play size={17} className="fill-current ml-0.5" />
                            )}
                        </button>

                        {/* Siguiente */}
                        <button
                            onClick={nextTrack}
                            className="p-1.5 transition-all duration-200 hover:scale-110 active:scale-90"
                            style={{ color: 'var(--text-secondary)' }}
                            aria-label="Siguiente"
                            title="Siguiente"
                        >
                            <SkipForward size={18} className="fill-current" />
                        </button>

                        {/* Repeat — solo desktop */}
                        <button
                            onClick={toggleRepeat}
                            className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 hidden sm:flex items-center justify-center relative ${repeat ? 'text-spotify-green' : ''}`}
                            style={!repeat ? { color: 'var(--text-secondary)' } : undefined}
                            aria-label="Repetir"
                            title="Repetir"
                        >
                            <Repeat size={16} />
                            {repeat && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-spotify-green" />}
                        </button>
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-full flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <span className="w-7 sm:w-10 text-right tabular-nums flex-shrink-0">{formatearTiempo(tiempoActual)}</span>
                        <div
                            onClick={handleProgressClick}
                            className="flex-1 h-1 rounded-full cursor-pointer group/bar relative hover:h-[5px] transition-all duration-150 min-w-0"
                            style={{ backgroundColor: 'var(--bg-progress)' }}
                        >
                            <div
                                className="h-full group-hover/bar:bg-spotify-green rounded-full transition-colors duration-200 relative"
                                style={{ width: `${progress}%`, backgroundColor: 'var(--text-primary)' }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-md bg-white opacity-0 scale-0 group-hover/bar:opacity-100 group-hover/bar:scale-100 transition-all duration-200" />
                            </div>
                        </div>
                        <span className="w-7 sm:w-10 tabular-nums flex-shrink-0">{formatearTiempo(duracionTotal)}</span>
                    </div>
                </div>

                {/* ── DERECHA: volumen (solo desktop) ── */}
                <div className="hidden sm:flex items-center justify-end gap-2 w-[30%] flex-shrink-0">
                    <button
                        onClick={() => setVolume(volume > 0 ? 0 : 75)}
                        className="transition-all duration-200 hover:scale-110"
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
                        className="w-24 cursor-pointer"
                        style={{ accentColor: '#1DB954' }}
                        aria-label="Volumen"
                        title={`Volumen: ${volume}%`}
                    />
                </div>
            </div>
        </footer>
    );
}