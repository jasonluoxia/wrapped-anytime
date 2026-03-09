import { config } from 'dotenv';
import { express } from 'express';
import {open } from 'open';
import { SpotifyWebApi } from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUrl: process.env.SPOTIFY_REDIRECT_URL
});

const app = express();
const PORT = process.env.PORT || 8888;