export interface UserProfile {
    display_name: string,
    email: string,
    id: string;
    country: string;
    product: string;
    images: Array<{
        url: string;
        height: number;
        width: number;
    }>;
}

export interface ArtistProfile {
    id: string;
    name: string;
    genres: string[];
    popularity: number;
    images: Array<{
        url: string;
        height: number;
        width: number;
    }>;
    external_urls: {
        spotify: string;
    };
}

export interface Song {
    id: string;
    name: string;
    popularity: number;
    duration_ms: number;
    artists: Array<{
        id: string;
        name: string;
    }>;
    album: {
        name: string;
        images: Array<{
        url: string;
        height: number;
        width: number;
        }>;
    };
    external_urls: {
        spotify: string;
    };
}

export interface UserData {
    profile: UserProfile | null;
    topArtists: ArtistProfile[];
    topTracks: Song[];
    lastUpdated: Date | null;
    accessToken: string | null;
    refreshToken: string |null
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export interface TimeRangeOption {
    value: TimeRange;
    label: string;
    description: string;
}


export interface SpotifyConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string[];
}

export interface ServerConfig {
    port: number;
    environment: 'development' | 'production';
}

export interface AppConfig {
    spotify: SpotifyConfig;
    server: ServerConfig;
}