// ============================================
// Componente Sidebar - Barra Lateral Fija
// Creado por Roger Cipagauta 2025
// ============================================
// Navegación principal, lista de playlists,
// responsive con menu hamburguesa en móvil.
// ============================================

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, Plus, Heart, X, Menu } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { cargarTodasLasPlaylists, obtenerPlaylistsFallback } from '../services/api';
import type { Playlist } from '../services/api';

export default function Sidebar() {
    const { sidebarOpen, toggleSidebar } = usePlayerStore();
    const location = useLocation();
    const [playlists, setPlaylists] = useState<Playlist[]>(obtenerPlaylistsFallback());

    // Cargar playlists reales al montar el componente
    useEffect(() => {
        cargarTodasLasPlaylists().then((data) => {
            if (data.length > 0) setPlaylists(data);
        });
    }, []);

    // Links de navegación principal
    const itemsNav = [
        { icon: Home, label: 'Inicio', path: '/' },
        { icon: Search, label: 'Buscar', path: '/search' },
        { icon: Library, label: 'Tu Biblioteca', path: '/library' },
    ];

    const estaActivo = (path: string) => location.pathname === path;

    return (
        <>
            {/* Overlay oscuro en móvil cuando el sidebar está abierto */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                />
            )}

            {/* Botón hamburguesa para móvil */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-full theme-bg-btn theme-text-primary hover:scale-105 transition-all backdrop-blur-md shadow-lg"
                aria-label="Abrir menú"
                title="Abrir menú"
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Barra lateral */}
            <aside
                className={`
                    fixed top-0 left-0 h-[100dvh] w-[280px] z-50
                    flex flex-col gap-2 p-2 pb-[80px] lg:pb-2
                    transition-all duration-300 ease-in-out
                    lg:translate-x-0 lg:static lg:h-full lg:z-auto
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                style={{ backgroundColor: 'var(--bg-sidebar)' }}
            >
                {/* Navegación principal */}
                <div className="rounded-xl p-4 flex flex-col gap-0.5 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-sidebar-section)' }}>
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-3 py-2 mb-3">
                        <div className="w-9 h-9 bg-spotify-green rounded-full flex items-center justify-center shadow-md shadow-spotify-green/30 flex-shrink-0">
                            <span className="text-black font-bold text-base">♪</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>Spotify</span>
                    </div>

                    {/* Links de navegación */}
                    {itemsNav.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => sidebarOpen && toggleSidebar()}
                            className="flex items-center gap-4 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden"
                            style={{ color: estaActivo(item.path) ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                        >
                            {/* Indicador activo */}
                            {estaActivo(item.path) && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-spotify-green rounded-r-full" />
                            )}
                            {/* Fondo activo */}
                            {estaActivo(item.path) && (
                                <span className="absolute inset-0 rounded-lg opacity-10 bg-spotify-green pointer-events-none" />
                            )}
                            <item.icon
                                size={22}
                                className={`transition-all duration-200 group-hover:scale-110 flex-shrink-0 ${estaActivo(item.path) ? 'text-spotify-green' : ''}`}
                            />
                            <span className={`text-sm font-semibold transition-colors duration-200 group-hover:text-spotify-green ${estaActivo(item.path) ? 'text-spotify-green' : ''}`}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Biblioteca / Playlists */}
                <div className="rounded-xl p-4 flex-1 overflow-hidden flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-sidebar-section)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                            <Library size={20} />
                            <span className="text-sm font-bold">Tu Biblioteca</span>
                        </div>
                        <button
                            className="p-1.5 rounded-full transition-all duration-200 hover:scale-110 hover:bg-white/10"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            <Plus size={17} />
                        </button>
                    </div>

                    {/* Crear playlist */}
                    <div
                        className="rounded-xl p-4 mb-3 transition-all duration-300 hover:brightness-110 cursor-pointer"
                        style={{ backgroundColor: 'var(--bg-elevated)' }}
                    >
                        <p className="text-sm font-bold mb-1 leading-tight" style={{ color: 'var(--text-primary)' }}>
                            Crea tu primera playlist
                        </p>
                        <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Es fácil, te ayudamos</p>
                        <button className="bg-spotify-green text-black text-xs font-bold px-4 py-1.5 rounded-full hover:scale-105 hover:bg-spotify-green-light transition-all duration-200 shadow-md shadow-black/20 active:scale-95">
                            Crear playlist
                        </button>
                    </div>

                    {/* Canciones favoritas y subir manuales */}
                    <div className="flex flex-col gap-2 mb-3">
                        {/* Listado de mis favoritos */}
                        <Link
                            to="/misfavoritos"
                            onClick={() => sidebarOpen && toggleSidebar()}
                            className="rounded-xl p-3 transition-all duration-200 hover:brightness-110 cursor-pointer group/fav"
                            style={{ backgroundColor: 'var(--bg-elevated)' }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-400 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/30 group-hover/fav:scale-105 transition-transform duration-200">
                                    <Heart size={16} className="text-white fill-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                        Mis Favoritos
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Playlist automática</p>
                                </div>
                            </div>
                        </Link>

                        {/* Agregar canciones manuales */}
                        <div
                            className="rounded-xl p-3 transition-all duration-200 hover:brightness-110 cursor-pointer group/manual border border-dashed"
                            style={{ backgroundColor: 'transparent', borderColor: 'var(--border-subtle)' }}
                            title="Próximamente: Sube tus propias canciones"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/manual:scale-105 transition-transform duration-200" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                    <Plus size={16} style={{ color: 'var(--text-secondary)' }} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                                        Agregar mis canciones
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Sube música manual</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de playlists */}
                    <div className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar -mx-1 px-1">
                        {playlists.map((playlist) => {
                            const activa = location.pathname === `/playlist/${playlist.id}`;
                            return (
                                <Link
                                    key={playlist.id}
                                    to={`/playlist/${playlist.id}`}
                                    onClick={() => sidebarOpen && toggleSidebar()}
                                    className={`
                                        flex items-center gap-3 p-2 rounded-lg
                                        transition-all duration-200 group relative
                                        theme-bg-card-hover
                                        ${activa ? 'theme-bg-elevated' : ''}
                                    `}
                                >
                                    {activa && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-spotify-green rounded-r-full" />
                                    )}
                                    <img
                                        src={playlist.cover}
                                        alt={playlist.title}
                                        className={`w-10 h-10 rounded-md object-cover flex-shrink-0 transition-all duration-200 ${activa ? 'shadow-md shadow-black/40' : 'group-hover:scale-105'}`}
                                        loading="lazy"
                                    />
                                    <div className="min-w-0">
                                        <p
                                            className={`text-sm truncate font-medium transition-colors duration-200 group-hover:text-spotify-green ${activa ? 'text-spotify-green' : ''}`}
                                            style={!activa ? { color: 'var(--text-primary)' } : undefined}
                                        >
                                            {playlist.title}
                                        </p>
                                        <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                                            Playlist • {playlist.tracks.length} canciones
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Crédito del desarrollador */}
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <p className="text-[10px] text-center tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                            Desarrollado por{' '}
                            <span className="font-bold text-spotify-green">Roger Cipagauta</span>
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}