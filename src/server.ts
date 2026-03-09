import { config } from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import SpotifyWebApi = require("spotify-web-api-node");
import { UserProfile, ArtistProfile, Song, UserData, TimeRange } from './types';
import { userData } from './data';

const app = express();
const PORT = process.env.PORT || 8888;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URL
});

app.get('/api/auth/login', (req: Request, res: Response) => {
  const scopes = ['user-top-read', 'user-read-private', 'user-read-email'];
  const authURL = spotifyApi.createAuthorizeURL(scopes, 'state-string');
  res.redirect(authURL);
});

app.get('/api/auth/callback', async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code || typeof(code) !== 'string') {
    res.status(400).json({
      error: 'Authorisation code missing'
    });
    return;
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    userData.accessToken = data.body.access_token;
    userData.refreshToken = data.body.refresh_token;

    // set tokens on api instance
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);

    const profileData = await spotifyApi.getMe();
    userData.profile = profileData.body as UserProfile;
    
    const [artists, tracks] = await Promise.all([
      spotifyApi.getMyTopArtists({ limit: 20, time_range: 'medium_term'}),
      spotifyApi.getMyTopTracks({ limit: 20, time_range: 'medium_term'}),
    ]);

    userData.topArtists = artists.body.items as ArtistProfile[];
    userData.topTracks = tracks.body.items as Song[];

    userData.lastUpdated = new Date();

    res.redirect('http://localhost:3000/dashboard?auth=success');
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).json({
      error: 'Authentication Failed'
    });
  }
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  userData.accessToken = null;
  userData.lastUpdated = null;
  userData.profile = null;
  userData.refreshToken = null;
  userData.topArtists = [];
  userData.topTracks = [];
  res.json({
    success: true,
    message: 'Logout success'
  })
});

app.post('/api/auth/refresh-token', async (req: Request, res: Response) => {
  if (!userData.refreshToken) {
    res.status(401).json({ error: 'No refresh token available' });
    return;
  }

  try {
    spotifyApi.setRefreshToken(userData.refreshToken);
    const data = await spotifyApi.refreshAccessToken();
    
    userData.accessToken = data.body.access_token;
    spotifyApi.setAccessToken(data.body.access_token);
    
    res.json({ 
      success: true, 
      message: 'Token refreshed successfully' 
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

//TODO
//get profile details /api/profile
//get profile summary w top artists and tracks /api/profile/summary
//get top artists and a small info abt each artist /api/artists/top
//get genre breakdown for each top artist /api/artists/genres
//get users top tracks /api/tracks/top
//get user most recently played /api/tracks/recent note needs additional scope
//post refresh to get recent data from api /api/refresh same as callback pretty much


///////////////////////////////////////////error handling

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`
🎵 Spotify Wrapped Backend API
===============================
📍 URL: http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/api
🔑 Health: http://localhost:${PORT}/api/health

📡 Available Endpoints:
   GET    /api/auth/login
   GET    /api/auth/callback (async)
   GET    /api/auth/status
   POST   /api/auth/logout
   POST   /api/auth/refresh-token (async)
   GET    /api/profile
   GET    /api/profile/summary
   GET    /api/artists/top (async)
   GET    /api/artists/genres
   GET    /api/tracks/top (async)
   GET    /api/tracks/recent
   POST   /api/refresh (async)
   GET    /api/health
   GET    /api

🚀 Server ready for frontend connections!
   CORS enabled for: http://localhost:3000, http://localhost:5173
  `);
});