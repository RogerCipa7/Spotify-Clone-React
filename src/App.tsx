// ============================================
// App Principal - Spotify Clone
// Creado por Roger Cipagauta 2025
// -------------------------------
// ============================================
// Layout principal de la SPA con sidebar,
// header, contenido principal, y reproductor.
// ============================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { usePlayerStore } from './store/usePlayerStore';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Player from './components/Player';
import Home from './pages/Home';
import Playlist from './pages/Playlist';
import Search from './pages/Search';
import Library from './pages/Library';
import Favorites from './pages/Favorites';

export default function App() {
  // Obtener tema actual del store global
  const theme = usePlayerStore((s) => s.theme);

  return (
    <BrowserRouter>
      {/* Aplicar clase del tema (dark por defecto, light-theme para claro) */}
      <div className={theme === 'light' ? 'light-theme' : ''}>
        <div className="h-screen flex flex-col overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
          {/* Layout principal: sidebar + contenido */}
          <div className="flex flex-1 overflow-hidden">
            {/* Barra lateral */}
            <Sidebar />

            {/* Área de contenido principal */}
            <main className="flex-1 overflow-y-auto custom-scrollbar transition-colors duration-300" style={{ background: `linear-gradient(to bottom, var(--gradient-top), var(--gradient-bottom))` }}>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/library" element={<Library />} />
                <Route path="/misfavoritos" element={<Favorites />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/playlist/:id" element={<Playlist />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
          </div>

          {/* Reproductor fijo inferior */}
          <Player />
        </div>
      </div>
    </BrowserRouter>
  );
}