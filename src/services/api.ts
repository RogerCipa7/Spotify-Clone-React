// ============================================
// Servicio de API - Spotify Clone
// Creado por Roger Cipagauta 2025
// -------------------------------
// ============================================
// Usa la iTunes Search API para obtener previews
// reales de 30 segundos de corridos tumbados,
// bélicos y regional mexicano.
// ============================================

import type { Track } from '../store/usePlayerStore';

// Interfaz de una playlist
export interface Playlist {
    id: string;
    title: string;
    description: string;
    cover: string;
    tracks: Track[];
}

// Interfaz de respuesta de iTunes
interface iTunesResult {
    trackId: number;
    trackName: string;
    artistName: string;
    collectionName: string;
    artworkUrl100: string;
    previewUrl: string;
    trackTimeMillis: number;
}

interface iTunesResponse {
    resultCount: number;
    results: iTunesResult[];
}

// Convertir resultado de iTunes a nuestro formato de Track
function itunesParaTrack(item: iTunesResult): Track {
    return {
        id: `track-${item.trackId}`,
        title: item.trackName,
        artist: item.artistName,
        album: item.collectionName || 'Sencillo',
        cover: item.artworkUrl100.replace('100x100', '600x600'),
        duration: Math.floor((item.trackTimeMillis || 30000) / 1000),
        previewUrl: item.previewUrl,
    };
}

// Configuración de las playlists con términos de búsqueda
const configuracionPlaylists = [
    {
        id: 'corridos-tumbados',
        title: 'Corridos Tumbados',
        description: 'Los mejores corridos tumbados del momento',
        query: 'corridos tumbados',
    },
    {
        id: 'peso-pluma',
        title: 'Éxitos de Peso Pluma',
        description: 'Lo mejor del doble P',
        query: 'Peso Pluma',
    },
    {
        id: 'natanael-cano',
        title: 'Natanael Cano Hits',
        description: 'El pionero de los corridos tumbados',
        query: 'Natanael Cano',
    },
    {
        id: 'fuerza-regida',
        title: 'Fuerza Regida Mix',
        description: 'Puro Fuerza Regida pa la raza',
        query: 'Fuerza Regida',
    },
    {
        id: 'junior-h',
        title: 'Junior H Esenciales',
        description: 'Sad corridos y más',
        query: 'Junior H corridos',
    },
    {
        id: 'grupo-frontera',
        title: 'Grupo Frontera',
        description: 'Norteño con estilo moderno',
        query: 'Grupo Frontera',
    },
    {
        id: 'corridos-belicos',
        title: 'Corridos Bélicos',
        description: 'Los corridos más pesados y bélicos',
        query: 'corridos belicos',
    },
    {
        id: 'regional-mexicano',
        title: 'Regional Mexicano',
        description: 'Lo mejor del regional mexicano actual',
        query: 'regional mexicano 2025',
    },
    {
        id: 'luis-r-conriquez',
        title: 'Luis R Conriquez',
        description: 'Corridos y banda con Luis R',
        query: 'Luis R Conriquez',
    },
    {
        id: 'edicion-especial',
        title: 'Edición Especial Mix',
        description: 'Cumbias y corridos con Edición Especial',
        query: 'corridos tumbados 2025',
    },
    {
        id: 'tito-double-p',
        title: 'Tito Double P',
        description: 'Compositor y cantante de corridos pesados',
        query: 'Tito Double P',
    },
    {
        id: 'xavi',
        title: 'Xavi Éxitos',
        description: 'El de La Diabla y corridos románticos',
        query: 'Xavi',
    },
    {
        id: 'marca-registrada',
        title: 'Grupo Marca Registrada',
        description: 'Corridos frescos y banda',
        query: 'Marca Registrada',
    },
    {
        id: 'gabito-ballesteros',
        title: 'Gabito Ballesteros',
        description: 'Colaboraciones y corridos top',
        query: 'Gabito Ballesteros',
    },
    {
        id: 'oscar-maydon',
        title: 'Oscar Maydon',
        description: 'Corridos tumbados de nueva generación',
        query: 'Oscar Maydon',
    },
    {
        id: 'ivan-archivaldo',
        title: 'Ivan Archivaldo',
        description: 'Corridos pesados y letras fuertes',
        query: 'Ivan Archivaldo corridos',
    },
    {
        id: 'joel-de-la-p',
        title: 'Joel de la P',
        description: 'Corridos bélicos con flow urbano',
        query: 'Joel de la P corridos',
    },
    {
        id: 'chino-pacas',
        title: 'Chino Pacas',
        description: 'El Flow de Michoacán en su máxima expresión',
        query: 'Chino Pacas',
    },
    {
        id: 'raul-vega',
        title: 'Raúl Vega',
        description: 'Corridos tumbados del norte',
        query: 'Raul Vega corridos tumbados',
    },
    {
        id: 'calle-24',
        title: 'Calle 24',
        description: 'Trap y corridos mezclados a lo grande',
        query: 'Calle 24 corridos',
    },
    {
        id: 'el-fantasma',
        title: 'El Fantasma',
        description: 'Corridos bélicos con banda y tuba',
        query: 'El Fantasma corridos',
    },
    {
        id: 'los-alegres-del-barranco',
        title: 'Los Alegres del Barranco',
        description: 'Corridos tumbados en cuarteto',
        query: 'Los Alegres del Barranco',
    },
    {
        id: 'javier-rosas',
        title: 'Javier Rosas',
        description: 'Banda y corridos de Sinaloa',
        query: 'Javier Rosas corridos',
    },
    {
        id: 'neton-vega',
        title: 'Netón Vega',
        description: 'Corridos norteños con mucho estilo',
        query: 'Neton Vega',
    },
    {
        id: 'los-dos-carnales',
        title: 'Los Dos Carnales',
        description: 'Corridos bélicos y románticos pa toda la raza',
        query: 'Los Dos Carnales corridos',
    },
    {
        id: 'santa-fe-klan',
        title: 'Santa Fe Klan',
        description: 'Rap y corridos desde Guanajuato',
        query: 'Santa Fe Klan',
    },
    {
        id: 'herencia-de-patrones',
        title: 'Herencia de Patrones',
        description: 'Corridos bélicos de alto calibre',
        query: 'Herencia de Patrones',
    },
    {
        id: 'lenin-ramirez',
        title: 'Lenin Ramírez',
        description: 'Banda con corridos de impacto',
        query: 'Lenin Ramirez corridos',
    },
    {
        id: 'legado-7',
        title: 'Legado 7',
        description: 'Corridos pesados con estilo único',
        query: 'Legado 7 corridos',
    },
    {
        id: 't3r-elemento',
        title: 'T3R Elemento',
        description: 'Corridos tumbados con sintetizadores',
        query: 'T3R Elemento',
    },
    {
        id: 'los-tucanes-de-tijuana',
        title: 'Los Tucanes de Tijuana',
        description: 'Clásicos del narcocorrido tijuanense',
        query: 'Los Tucanes de Tijuana corridos',
    },
    {
        id: 'carin-leon',
        title: 'Carín León',
        description: 'Banda y regional con voz única',
        query: 'Carin Leon regional mexicano',
    },
    {
        id: 'eslabon-armado',
        title: 'Eslabón Armado',
        description: 'Corridos románticos y tumbados',
        query: 'Eslabon Armado',
    },
    // ── Nuevos para sección "Para Ti" ────────────────────────────────────────
    {
        id: 'victor-mendivil',
        title: 'Víctor Mendívil',
        description: 'Corridos tumbados con mucho sentimiento',
        query: 'Victor Mendivil corridos',
    },
    {
        id: 'darlles-de-la-sierra',
        title: 'Darlles de la Sierra',
        description: 'Corridos bélicos de la sierra',
        query: 'Darlles de la Sierra corridos',
    },
    {
        id: 'armenta',
        title: 'Armenta',
        description: 'Corridos tumbados al estilo Sinaloa',
        query: 'Armenta corridos tumbados',
    },
    {
        id: 'clave-especial',
        title: 'Clave Especial',
        description: 'Banda y corridos con clave especial',
        query: 'Clave Especial corridos banda',
    },
];

// Cache para guardar los datos ya descargados
const cachePlaylist: Map<string, Playlist> = new Map();
let todasLasPlaylists: Playlist[] | null = null;

// Buscar canciones en iTunes API
async function buscarEnItunes(termino: string, limite: number = 15): Promise<Track[]> {
    try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(termino)}&media=music&limit=${limite}&country=MX&lang=es_mx`;
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
        const datos: iTunesResponse = await respuesta.json();

        return datos.results
            .filter((item) => item.previewUrl && item.trackName)
            .map(itunesParaTrack);
    } catch (error) {
        console.error(`Error buscando "${termino}":`, error);
        return [];
    }
}

// Cargar una playlist específica
export async function cargarPlaylist(id: string): Promise<Playlist | undefined> {
    if (cachePlaylist.has(id)) return cachePlaylist.get(id);

    const config = configuracionPlaylists.find((p) => p.id === id);
    if (!config) return undefined;

    const tracks = await buscarEnItunes(config.query);

    const playlist: Playlist = {
        id: config.id,
        title: config.title,
        description: config.description,
        cover: tracks.length > 0 ? tracks[0].cover : `https://picsum.photos/seed/${config.id}/600/600`,
        tracks,
    };

    cachePlaylist.set(id, playlist);
    return playlist;
}

// Cargar todas las playlists
export async function cargarTodasLasPlaylists(): Promise<Playlist[]> {
    if (todasLasPlaylists) return todasLasPlaylists;

    const promesas = configuracionPlaylists.map(async (config) => {
        const tracks = await buscarEnItunes(config.query, 12);
        return {
            id: config.id,
            title: config.title,
            description: config.description,
            cover: tracks.length > 0 ? tracks[0].cover : `https://picsum.photos/seed/${config.id}/600/600`,
            tracks,
        } as Playlist;
    });

    todasLasPlaylists = await Promise.all(promesas);
    todasLasPlaylists.forEach((p) => cachePlaylist.set(p.id, p));

    return todasLasPlaylists;
}

// Obtener playlist por ID (con cache)
export async function obtenerPlaylistPorId(id: string): Promise<Playlist | undefined> {
    if (cachePlaylist.has(id)) return cachePlaylist.get(id);
    return cargarPlaylist(id);
}

// Datos de fallback
export function obtenerPlaylistsFallback(): Playlist[] {
    return configuracionPlaylists.map((config) => ({
        id: config.id,
        title: config.title,
        description: config.description,
        cover: `https://picsum.photos/seed/${config.id}/600/600`,
        tracks: [],
    }));
}