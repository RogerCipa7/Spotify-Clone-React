// ============================================
// Store del Reproductor - Spotify Clone
// -------------------------------
// ============================================
// Estado global con Zustand para manejar:
// - Canción actual y cola de reproducción
// - Estado play/pause con Audio real
// - Progreso, volumen, shuffle, repeat
// - Tema claro/oscuro
// - Sidebar móvil
// ============================================

import { create } from 'zustand';

// Interfaz de un track/canción
export interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    cover: string;
    duration: number; // en segundos
    previewUrl: string; // URL del audio real (preview de 30s)
}

// Estado del reproductor
interface PlayerState {
    // Reproducción
    currentTrack: Track | null;
    queue: Track[]; // Cola de canciones (playlist actual)
    queueIndex: number; // Índice actual en la cola
    isPlaying: boolean;
    progress: number; // 0–100
    currentTime: number; // tiempo actual en segundos
    volume: number; // 0–100
    shuffle: boolean;
    repeat: boolean;

    // UI
    theme: 'dark' | 'light';
    sidebarOpen: boolean;
    isLoading: boolean;
    favorites: Track[]; // Canciones favoritas

    // Elemento de audio
    audio: HTMLAudioElement | null;

    // Acciones de reproducción
    setTrack: (track: Track) => void;
    playFromPlaylist: (tracks: Track[], index: number) => void;
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    setProgress: (progress: number) => void;
    setCurrentTime: (time: number) => void;
    seekTo: (percent: number) => void;
    setVolume: (volume: number) => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
    setIsLoading: (loading: boolean) => void;

    // Acciones de UI
    toggleTheme: () => void;
    toggleSidebar: () => void;
    toggleFavorite: (track: Track) => void;
    isFavorite: (trackId: string) => boolean;

    // Inicializar audio
    initAudio: () => HTMLAudioElement;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    // Estado inicial
    currentTrack: null,
    queue: [],
    queueIndex: -1,
    isPlaying: false,
    progress: 0,
    currentTime: 0,
    volume: 75,
    shuffle: false,
    repeat: false,
    theme: 'dark',
    sidebarOpen: false,
    isLoading: false,
    favorites: (() => {
        try {
            return JSON.parse(localStorage.getItem('spotify-clone-favorites') || '[]');
        } catch (e) {
            console.error('Error loading favorites:', e);
            return [];
        }
    })(),
    audio: null,

    // Inicializar el elemento de audio HTML5
    initAudio: () => {
        let audio = get().audio;
        if (audio) return audio;

        audio = new Audio();
        audio.volume = get().volume / 100;

        // Actualizar progreso mientras se reproduce
        audio.addEventListener('timeupdate', () => {
            const a = get().audio;
            if (!a || !a.duration) return;
            const porcentaje = (a.currentTime / a.duration) * 100;
            set({ progress: porcentaje, currentTime: a.currentTime });
        });

        // Cuando termina la canción
        audio.addEventListener('ended', () => {
            const state = get();
            if (state.repeat) {
                // Repetir la misma canción
                const a = get().audio;
                if (a) {
                    a.currentTime = 0;
                    a.play();
                }
            } else {
                // Siguiente canción
                state.nextTrack();
            }
        });

        // Cuando está cargando
        audio.addEventListener('waiting', () => set({ isLoading: true }));
        audio.addEventListener('canplay', () => set({ isLoading: false }));

        // Error al cargar
        audio.addEventListener('error', () => {
            console.error('Error cargando el audio');
            set({ isLoading: false, isPlaying: false });
        });

        set({ audio });
        return audio;
    },

    // Reproducir un track individual
    setTrack: (track) => {
        const audio = get().initAudio();
        audio.src = track.previewUrl;
        audio.play().catch(console.error);
        set({
            currentTrack: track,
            isPlaying: true,
            progress: 0,
            currentTime: 0,
            isLoading: true,
        });
    },

    // Reproducir desde una playlist completa
    playFromPlaylist: (tracks, index) => {
        const audio = get().initAudio();
        const track = tracks[index];
        if (!track) return;

        audio.src = track.previewUrl;
        audio.play().catch(console.error);
        set({
            currentTrack: track,
            queue: tracks,
            queueIndex: index,
            isPlaying: true,
            progress: 0,
            currentTime: 0,
            isLoading: true,
        });
    },

    // Play
    play: () => {
        const audio = get().audio;
        if (audio && get().currentTrack) {
            audio.play().catch(console.error);
            set({ isPlaying: true });
        }
    },

    // Pause
    pause: () => {
        const audio = get().audio;
        if (audio) {
            audio.pause();
            set({ isPlaying: false });
        }
    },

    // Toggle play/pause
    togglePlay: () => {
        const state = get();
        if (!state.currentTrack) return;
        if (state.isPlaying) {
            state.pause();
        } else {
            state.play();
        }
    },

    // Siguiente canción
    nextTrack: () => {
        const state = get();
        if (state.queue.length === 0) return;

        let nextIndex: number;
        if (state.shuffle) {
            // Aleatorio (evitar repetir la actual)
            do {
                nextIndex = Math.floor(Math.random() * state.queue.length);
            } while (nextIndex === state.queueIndex && state.queue.length > 1);
        } else {
            nextIndex = state.queueIndex + 1;
            if (nextIndex >= state.queue.length) {
                if (state.repeat) {
                    nextIndex = 0; // Volver al inicio si hay repeat
                } else {
                    set({ isPlaying: false });
                    return;
                }
            }
        }

        const nextTrack = state.queue[nextIndex];
        if (nextTrack) {
            const audio = get().initAudio();
            audio.src = nextTrack.previewUrl;
            audio.play().catch(console.error);
            set({
                currentTrack: nextTrack,
                queueIndex: nextIndex,
                isPlaying: true,
                progress: 0,
                currentTime: 0,
                isLoading: true,
            });
        }
    },

    // Canción anterior
    prevTrack: () => {
        const state = get();
        if (state.queue.length === 0) return;

        // Si llevamos más de 3 segundos, reiniciar la canción actual
        const audio = get().audio;
        if (audio && audio.currentTime > 3) {
            audio.currentTime = 0;
            set({ progress: 0, currentTime: 0 });
            return;
        }

        let prevIndex = state.queueIndex - 1;
        if (prevIndex < 0) {
            prevIndex = state.repeat ? state.queue.length - 1 : 0;
        }

        const prevTrack = state.queue[prevIndex];
        if (prevTrack) {
            const a = get().initAudio();
            a.src = prevTrack.previewUrl;
            a.play().catch(console.error);
            set({
                currentTrack: prevTrack,
                queueIndex: prevIndex,
                isPlaying: true,
                progress: 0,
                currentTime: 0,
                isLoading: true,
            });
        }
    },

    // Establecer progreso manualmente
    setProgress: (progress) => set({ progress }),

    // Establecer tiempo actual
    setCurrentTime: (time) => set({ currentTime: time }),

    // Saltar a un porcentaje de la canción
    seekTo: (percent) => {
        const audio = get().audio;
        if (audio && audio.duration) {
            audio.currentTime = (percent / 100) * audio.duration;
            set({ progress: percent });
        }
    },

    // Cambiar volumen
    setVolume: (volume) => {
        const audio = get().audio;
        if (audio) {
            audio.volume = volume / 100;
        }
        set({ volume });
    },

    // Toggle shuffle (aleatorio)
    toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),

    // Toggle repeat (repetir)
    toggleRepeat: () => set((s) => ({ repeat: !s.repeat })),

    // Toggle tema claro/oscuro
    toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

    // Toggle sidebar en móvil
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

    // Toggle favorito
    toggleFavorite: (track) => {
        const { favorites } = get();
        const existe = favorites.find((f) => f.id === track.id);
        let nuevosFavoritos: Track[];

        if (existe) {
            nuevosFavoritos = favorites.filter((f) => f.id !== track.id);
        } else {
            nuevosFavoritos = [...favorites, track];
        }

        localStorage.setItem('spotify-clone-favorites', JSON.stringify(nuevosFavoritos));
        set({ favorites: nuevosFavoritos });
    },

    // Verificar si es favorito
    isFavorite: (trackId) => {
        return get().favorites.some((f) => f.id === trackId);
    },

    // Establecer estado de carga
    setIsLoading: (loading) => set({ isLoading: loading }),
}));
