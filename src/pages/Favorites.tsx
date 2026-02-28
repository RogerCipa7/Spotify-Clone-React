// ============================================
// Página Favorites - Mis Favoritos
// Creado por Roger Cipagauta 2025
// ============================================

import { Heart, Play, Pause, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';

export default function Favorites() {
    const navigate = useNavigate();
    const { favorites, currentTrack, isPlaying, toggleFavorite, playFromPlaylist, togglePlay } = usePlayerStore();

    const estaReproduciendo = (trackId: string) =>
        currentTrack?.id === trackId && isPlaying;

    const alHacerClicEnTrack = (index: number) => {
        const track = favorites[index];
        if (currentTrack?.id === track.id) {
            togglePlay();
        } else {
            playFromPlaylist(favorites, index);
        }
    };

    function formatearDuracion(segundos: number): string {
        const m = Math.floor(segundos / 60);
        const s = Math.floor(segundos % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    return (
        <div className="pb-24">
            <div className="relative px-4 sm:px-6 lg:px-8 pt-6 pb-8">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/60 via-indigo-900/20 to-transparent" />

                <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br from-indigo-600 to-blue-400 rounded-lg flex items-center justify-center shadow-2xl shadow-indigo-500/40 shrink-0">
                        <Heart size={80} className="text-white fill-white" />
                    </div>

                    <div className="text-center sm:text-left">
                        <span className="text-xs font-bold uppercase tracking-widest text-white">Playlist</span>
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mt-2 mb-4">Mis Favoritos</h1>
                        <div className="flex items-center gap-2 text-sm text-white/80 font-medium justify-center sm:justify-start">
                            <span className="text-white font-bold">Roger Cipagauta</span>
                            <span>•</span>
                            <span>{favorites.length} canciones</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-4">
                {favorites.length > 0 && (
                    <button
                        onClick={() => playFromPlaylist(favorites, 0)}
                        className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-xl"
                    >
                        <Play size={24} className="text-black fill-black ml-1" />
                    </button>
                )}
            </div>

            <div className="px-2 sm:px-4 lg:px-8">
                {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Heart size={64} className="text-white/10 mb-4" />
                        <h2 className="text-xl font-bold mb-2">Aún no tienes favoritos</h2>
                        <p className="text-sm text-secondary mb-6">Las canciones que te gusten aparecerán aquí.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-all"
                        >
                            Explorar música
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-[40px_1fr_1fr_100px] gap-4 px-4 py-2 text-xs uppercase tracking-wider text-secondary border-bottom border-subtle mb-2">
                            <span className="text-center">#</span>
                            <span>Título</span>
                            <span className="hidden sm:block">Álbum</span>
                            <span className="flex justify-end pr-4"><Clock size={14} /></span>
                        </div>

                        {favorites.map((track, index) => {
                            const activo = currentTrack?.id === track.id;
                            const reproduciendo = estaReproduciendo(track.id);

                            return (
                                <button
                                    key={track.id}
                                    onClick={() => alHacerClicEnTrack(index)}
                                    className="w-full grid grid-cols-[40px_1fr_1fr_100px] gap-4 px-4 py-2 rounded-md transition-all group hover:bg-white/10 text-left items-center"
                                >
                                    <span className="flex justify-center text-secondary">
                                        {activo && reproduciendo ? (
                                            <Pause size={14} className="text-spotify-green" />
                                        ) : activo ? (
                                            <Play size={14} className="text-spotify-green fill-spotify-green" />
                                        ) : (
                                            <>
                                                <span className="group-hover:hidden">{index + 1}</span>
                                                <Play size={14} className="hidden group-hover:block text-white" />
                                            </>
                                        )}
                                    </span>

                                    <div className="flex items-center gap-3">
                                        <img src={track.cover} className="w-10 h-10 rounded" alt="" />
                                        <div className="truncate">
                                            <p className={`font-medium truncate ${activo ? 'text-spotify-green' : 'text-primary'}`}>{track.title}</p>
                                            <p className="text-xs text-secondary truncate">{track.artist}</p>
                                        </div>
                                    </div>

                                    <span className="text-sm text-secondary truncate hidden sm:block">{track.album}</span>

                                    <div className="flex items-center justify-end gap-4 pr-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(track);
                                            }}
                                            className="text-spotify-green opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Heart size={16} className="fill-spotify-green" />
                                        </button>
                                        <span className="text-sm text-secondary tabular-nums w-10 text-right">{formatearDuracion(track.duration)}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
