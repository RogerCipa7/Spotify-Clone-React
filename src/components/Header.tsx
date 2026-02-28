// ============================================
// Componente Header - Barra Superior
// Creado por Roger Cipagauta
// ============================================

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sun, Moon, Bell, User, Github, Linkedin, ExternalLink } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

export default function Header() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = usePlayerStore();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        function handleClickFuera(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuAbierto(false);
            }
        }
        if (menuAbierto) {
            document.addEventListener('mousedown', handleClickFuera);
        }
        return () => document.removeEventListener('mousedown', handleClickFuera);
    }, [menuAbierto]);

    return (
        <>
            {/* Estilos del dropdown */}
            <style>{`
                /* ── Trigger button ─────────────────────────── */
                .profile-btn-inner {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border-radius: 999px;
                    padding: 4px 12px 4px 4px;
                    cursor: pointer;
                    transition: transform 0.15s;
                    outline: none;
                }
                .profile-btn-inner:active { transform: scale(0.98); }

                .avatar-ring {
                    width: 28px; height: 28px;
                    border-radius: 50%;
                    background: #1DB954;
                    display: flex; align-items: center; justify-content: center;
                    color: #000;
                    box-shadow: 0 0 0 2px transparent;
                    transition: box-shadow 0.2s;
                    flex-shrink: 0;
                }
                .profile-btn-inner:hover .avatar-ring {
                    box-shadow: 0 0 0 2px #1ed760;
                }

                .chevron-icon {
                    width: 14px; height: 14px;
                    color: var(--text-secondary);
                    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1);
                    flex-shrink: 0;
                }
                .chevron-icon.open { transform: rotate(180deg); }

                /* ── Dropdown ───────────────────────────────── */
                .profile-dropdown {
                    position: absolute;
                    right: 0;
                    top: calc(100% + 8px);
                    width: 272px;
                    background: var(--bg-elevated);
                    border-radius: 8px;
                    border: 1px solid var(--border-subtle);
                    box-shadow: 0 16px 48px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4);
                    overflow: hidden;
                    z-index: 9999;
                    transform-origin: top right;
                    animation: dropdownIn 0.2s cubic-bezier(.34,1.4,.64,1) forwards;
                }

                @keyframes dropdownIn {
                    from { opacity: 0; transform: scale(0.94) translateY(-6px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0); }
                }

                /* Header del dropdown */
                .dropdown-header-section {
                    padding: 16px;
                    border-bottom: 1px solid var(--border-subtle);
                    background: linear-gradient(135deg, rgba(29,185,84,0.12) 0%, transparent 60%);
                    position: relative;
                    overflow: hidden;
                }
                .dropdown-header-section::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 10% 50%, rgba(29,185,84,0.08) 0%, transparent 70%);
                    pointer-events: none;
                }

                .dropdown-header-inner {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    position: relative;
                    z-index: 1;
                }

                .dropdown-big-avatar {
                    width: 48px; height: 48px;
                    border-radius: 50%;
                    background: #1DB954;
                    display: flex; align-items: center; justify-content: center;
                    color: #000;
                    flex-shrink: 0;
                    box-shadow: 0 0 0 3px rgba(29,185,84,0.3), 0 4px 12px rgba(0,0,0,0.4);
                    position: relative;
                }
                .dropdown-big-avatar::after {
                    content: '';
                    position: absolute;
                    inset: -4px;
                    border-radius: 50%;
                    border: 1.5px solid rgba(29,185,84,0.25);
                    animation: avatarPulse 2.5s ease-in-out infinite;
                }
                @keyframes avatarPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.4; transform: scale(1.08); }
                }

                .dropdown-name {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--text-primary);
                    letter-spacing: 0.01em;
                    line-height: 1.3;
                }
                .dropdown-role-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    margin-top: 4px;
                    font-size: 11px;
                    color: #1DB954;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    background: rgba(29,185,84,0.12);
                    padding: 2px 8px;
                    border-radius: 4px;
                }
                .role-dot { width: 5px; height: 5px; border-radius: 50%; background: #1DB954; }

                /* Links */
                .dropdown-links-section { padding: 8px; }

                .dropdown-link-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 12px;
                    border-radius: 6px;
                    text-decoration: none;
                    color: var(--text-primary);
                    transition: background 0.15s;
                    position: relative;
                    overflow: hidden;
                }
                .dropdown-link-item::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 0;
                    background: #1DB954;
                    border-radius: 0 3px 3px 0;
                    transition: width 0.15s;
                }
                .dropdown-link-item:hover { background: rgba(255,255,255,0.07); }
                .dropdown-link-item:hover::before { width: 3px; }

                .link-icon-box {
                    width: 36px; height: 36px;
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    transition: transform 0.15s;
                }
                .dropdown-link-item:hover .link-icon-box { transform: scale(1.08); }
                .icon-box-linkedin { background: rgba(10,102,194,0.15); color: #0A66C2; }
                .icon-box-github   { background: rgba(255,255,255,0.08); color: var(--text-primary); }

                .link-label-main {
                    font-size: 13px;
                    font-weight: 600;
                    line-height: 1.3;
                }
                .link-label-sub {
                    font-size: 11px;
                    color: var(--text-secondary);
                    margin-top: 1px;
                }

                .link-arrow {
                    color: var(--text-secondary);
                    opacity: 0;
                    transform: translateX(-4px);
                    transition: opacity 0.15s, transform 0.15s;
                    flex-shrink: 0;
                }
                .dropdown-link-item:hover .link-arrow {
                    opacity: 1;
                    transform: translateX(0);
                }

                /* Footer */
                .dropdown-footer-section {
                    padding: 10px 16px;
                    border-top: 1px solid var(--border-subtle);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }
                .footer-label {
                    font-size: 10.5px;
                    color: var(--text-secondary);
                    letter-spacing: 0.03em;
                }
                .footer-sep { width: 3px; height: 3px; border-radius: 50%; background: var(--text-secondary); opacity: 0.5; }
            `}</style>

            <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 backdrop-blur-md transition-colors duration-300" style={{ backgroundColor: 'var(--bg-header)' }}>
                {/* Izquierda: Flechas de navegación */}
                <div className="flex items-center gap-2 ml-10 lg:ml-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1.5 rounded-full theme-bg-btn theme-bg-btn-hover transition-all duration-200 hover:scale-105"
                        style={{ color: 'var(--text-primary)' }}
                        aria-label="Volver"
                        title="Volver"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => navigate(1)}
                        className="p-1.5 rounded-full theme-bg-btn theme-bg-btn-hover transition-all duration-200 hover:scale-105"
                        style={{ color: 'var(--text-primary)' }}
                        aria-label="Adelante"
                        title="Adelante"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Derecha: Acciones */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Toggle de tema */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full theme-bg-btn theme-bg-btn-hover transition-all duration-200 hover:scale-110 hover:rotate-12"
                        style={{ color: 'var(--text-primary)' }}
                        aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                        title={theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Enlace al Portafolio (Campana) */}
                    <a
                        href="https://portafoliorc.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full theme-bg-btn theme-bg-btn-hover transition-all duration-200 hover:scale-105 hidden sm:flex"
                        style={{ color: 'var(--text-primary)' }}
                        aria-label="Portafolio"
                        title="Visitar Portafolio"
                    >
                        <Bell size={18} />
                    </a>

                    {/* Perfil con dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuAbierto(!menuAbierto)}
                            className="profile-btn-inner theme-bg-btn theme-bg-btn-hover"
                        >
                            <div className="avatar-ring">
                                <User size={14} className="text-black" />
                            </div>
                            <span className="text-sm font-semibold hidden sm:inline" style={{ color: 'var(--text-primary)' }}>Perfil</span>
                            <svg
                                className={`chevron-icon ${menuAbierto ? 'open' : ''}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {/* Menú desplegable mejorado */}
                        {menuAbierto && (
                            <div className="profile-dropdown">
                                {/* Header con info del desarrollador */}
                                <div className="dropdown-header-section">
                                    <div className="dropdown-header-inner">
                                        <div className="dropdown-big-avatar">
                                            <User size={22} className="text-black" />
                                        </div>
                                        <div>
                                            <p className="dropdown-name">Roger Cipagauta</p>
                                            <p className="dropdown-role-badge">
                                                <span className="role-dot"></span>
                                                Desarrollador
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Enlaces */}
                                <div className="dropdown-links-section">
                                    <a
                                        href="https://www.linkedin.com/in/roger-cipagauta-b1626b329/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="dropdown-link-item"
                                    >
                                        <div className="link-icon-box icon-box-linkedin">
                                            <Linkedin size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="link-label-main">LinkedIn</p>
                                            <p className="link-label-sub">Ver perfil profesional</p>
                                        </div>
                                        <div className="link-arrow">
                                            <ExternalLink size={13} />
                                        </div>
                                    </a>

                                    <a
                                        href="https://github.com/rogercipa7"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="dropdown-link-item"
                                    >
                                        <div className="link-icon-box icon-box-github">
                                            <Github size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="link-label-main">GitHub</p>
                                            <p className="link-label-sub">Repositorios y proyectos</p>
                                        </div>
                                        <div className="link-arrow">
                                            <ExternalLink size={13} />
                                        </div>
                                    </a>
                                </div>

                                {/* Footer */}
                                <div className="dropdown-footer-section">
                                    <span className="footer-label">Spotify Clone</span>
                                    <span className="footer-sep"></span>
                                    <span className="footer-label">2025</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}