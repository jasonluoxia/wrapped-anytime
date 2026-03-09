import { config } from 'dotenv';
import { express } from 'express';
import {open } from 'open';
import { SpotifyWebApi } from 'spotify-web-api-node';

const app = express();
const PORT = process.env.PORT || 8888;

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUrl: process.env.SPOTIFY_REDIRECT_URL
});

const SCOPES = ['user-top-read', 'user-read-private', 'user-read-email'];