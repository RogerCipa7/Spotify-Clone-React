// ============================================
// Componente Card - Tarjeta de Playlist
// -------------------------------
// ============================================
// Tarjeta reutilizable con portada, título,
// descripción y botón de play con animación.
// ============================================

import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import type { Playlist } from '../services/api';

interface CardProps {
    playlist: Playlist;
}

export default function Card({ playlist }: CardProps) {
    return (
        <Link
            to={`/playlist/${playlist.id}`}
            className="group rounded-xl p-3 sm:p-4 transition-all duration-300 cursor-pointer relative overflow-hidden theme-bg-card-hover hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
            style={{ backgroundColor: 'var(--bg-card)' }}
        >
            {/* Imagen de portada */}
            <div className="relative mb-3 sm:mb-4 rounded-md overflow-hidden">
                <img
                    src={playlist.cover}
                    alt={playlist.title}
                    className="w-full aspect-square object-cover rounded-md transition-all duration-500 group-hover:scale-[1.04]"
                    style={{ boxShadow: `0 8px 24px var(--shadow-color)` }}
                    loading="lazy"
                />

                {/* Overlay oscuro al hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md pointer-events-none" />

                {/* Botón de reproducir con animación de aparición */}
                <button
                    className="
                        absolute bottom-2 right-2
                        w-11 h-11 sm:w-12 sm:h-12
                        bg-spotify-green rounded-full
                        flex items-center justify-center
                        shadow-xl shadow-black/50
                        opacity-0 translate-y-3 scale-90
                        group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
                        transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]
                        hover:scale-110 hover:bg-spotify-green-light
                        active:scale-95
                    "
                    aria-label={`Reproducir ${playlist.title}`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (playlist.tracks.length > 0) {
                            usePlayerStore.getState().playFromPlaylist(playlist.tracks, 0);
                        }
                    }}
                >
                    <Play size={20} className="text-black ml-0.5 fill-black" />
                </button>
            </div>

            {/* Información de la playlist */}
            <h3
                className="text-sm font-bold truncate mb-1 group-hover:text-spotify-green transition-colors duration-200 tracking-tight"
                style={{ color: 'var(--text-primary)' }}
            >
                {playlist.title}
            </h3>
            <p
                className="text-xs line-clamp-2 leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
            >
                {playlist.description}
            </p>
        </Link>
    );
}