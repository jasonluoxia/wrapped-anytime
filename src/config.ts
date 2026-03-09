import dotenv from 'dotenv';
import { AppConfig } from './types';

dotenv.config();

export const config: AppConfig = {
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
    redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:8888/callback',
    scopes: ['user-top-read', 'user-read-private', 'user-read-email']
  },
  server: {
    port: parseInt(process.env.PORT || '8888', 10),
    environment: (process.env.NODE_ENV as 'development' | 'production') || 'development'
  }
};

// Validate required config
export function validateConfig(): void {
  const { clientId, clientSecret } = config.spotify;
  
  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing Spotify credentials. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env file'
    );
  }
}