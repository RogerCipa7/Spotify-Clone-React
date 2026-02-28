// ============================================
// Página Library - Tu Biblioteca
// Creado por Roger Cipagauta 2025
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { cargarTodasLasPlaylists, obtenerPlaylistsFallback } from '../services/api';
import { Loader, Library as LibraryIcon, Heart, Plus } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import type { Playlist } from '../services/api';

export default function Library() {
    const { favorites } = usePlayerStore();
    const [playlists, setPlaylists] = useState<Playlist[]>(obtenerPlaylistsFallback());
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarTodasLasPlaylists()
            .then((data) => {
                if (data.length > 0) setPlaylists(data);
            })
            .finally(() => setCargando(false));
    }, []);

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-24 pt-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center shadow-lg shadow-spotify-green/30">
                    <LibraryIcon size={28} className="text-black" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Tu Biblioteca
                </h1>
            </div>

            {/* Acciones principales */}
            <div className="flex flex-wrap gap-4 mb-10">
                <Link
                    to="/misfavoritos"
                    className="flex items-center gap-3 px-6 py-3 rounded-full hover:scale-105 transition-all duration-200 shadow-md group"
                    style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
                >
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-400 rounded-full flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                        <Heart size={16} className="text-white fill-white" />
                    </div>
                    <div>
                        <p className="font-bold tracking-wide leading-tight">Mis Favoritos</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                            {favorites.length} canciones
                        </p>
                    </div>
                </Link>

                <button className="flex items-center gap-2 px-6 py-3 rounded-full hover:scale-105 transition-all duration-200 border-2 border-dashed group" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }} title="Próximamente">
                    <div className="w-9 h-9 flex items-center justify-center rounded-full group-hover:bg-white/5 transition-colors">
                        <Plus size={20} />
                    </div>
                    <span className="font-bold tracking-wide text-sm">Agregar mis canciones</span>
                </button>
            </div>

            {cargando && (
                <div className="flex items-center gap-3 mb-6 p-4 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    <Loader size={22} className="animate-spin text-spotify-green" />
                    <span style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium">
                        Cargando tu biblioteca...
                    </span>
                </div>
            )}

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Playlists Guardadas</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                    {playlists.map((playlist) => (
                        <Card key={playlist.id} playlist={playlist} />
                    ))}
                </div>
            </section>
        </div>
    );
}
