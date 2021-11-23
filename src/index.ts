import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

import { ConsoleColors } from './models/console-colors';
import { SpotifyResponse } from './models/spotify-response';

let token = process.env.SPOTIFY_TOKEN;

if (!token) {
  console.log(
    ConsoleColors.FgRed,
    '❌  Please, set "SPOTIFY_TOKEN" key on your environment.',
    ConsoleColors.Reset,
  );

  process.exit(1);
}

const spotifyApi = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  headers: { Authorization: `Bearer ${token}` },
  params: {},
});

async function removeFavorites() {
  let finished = false;

  do {
    try {
      const { data } = await spotifyApi.get<SpotifyResponse>('me/tracks', {
        params: { limit: 50 },
      });

      const queuedRequests = data.items.map((item) =>
        spotifyApi.delete(`me/tracks`, {
          params: {
            ids: item.track.id,
          },
        }),
      );

      await Promise.all(queuedRequests);

      finished = data.total <= 50;
    } catch (error: any) {
      console.log(error.message);

      try {
        fs.writeFileSync(
          path.join(__dirname, '..', 'error.json'),
          JSON.stringify(error, null, 2),
        );

        console.log(`Check ./error.json for details`);
      } catch {
        console.log(error);
      }

      process.exit(1);
    }
  } while (!finished);
}

removeFavorites();
