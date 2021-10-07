import axios from "axios";
import lodash from "lodash";
import { promisify } from "util";
import {
  ITEM_TYPES,
  ITEM_TYPES_RESULT_NAME,
} from "./consts.mjs";

const pause = promisify((delay, fn) => setTimeout(fn, delay));

export default {
  type: "app",
  app: "spotify",
  propDefinitions: {
    tracks: {
      type: "string[]",
      label: "Tracks",
      description: "An array of objects containing [Spotify URIs](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) of the tracks or episodes to remove. For example: `spotify:track:4iV5W9uYEdYUVa79Axb7Rh`. A maximum of 100 objects can be sent at once.",
    },
    trackId: {
      type: "string",
      label: "Track ID",
      description: "The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the track. For example: `4iV5W9uYEdYUVa79Axb7Rh`.",
      useQuery: true,
      async options({ query }) {
        const tracks = await this.getItems(ITEM_TYPES.TRACK, query);
        if (!tracks) {
          return {
            options: [],
          };
        }

        return {
          options: tracks.map((track) => ({
            label: this.getTrackNameWithArtists(track),
            value: track.id,
          })),
        };
      },
    },
    artistId: {
      type: "string",
      label: "Artist ID",
      description: "The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the artist. For example: `43ZHCT0cAZBISjO8DG9PnE`.",
      useQuery: true,
      async options({ query }) {
        const artists = await this.getItems(ITEM_TYPES.ARTIST, query);
        if (!artists) {
          return {
            options: [],
          };
        }

        return {
          options: artists.map((artist) => ({
            label: artist.name,
            value: artist.id,
          })),
        };
      },
    },
    playlistId: {
      type: "string",
      label: "Playlist ID",
      description: "The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the playlist",
      async options() {
        const playlists = await this.getPlaylists();
        if (!playlists) {
          return {
            options: [],
          };
        }

        return {
          options: playlists.map((playlist) => ({
            label: playlist.name,
            value: playlist.id,
          })),
        };
      },
    },
  },
  methods: {
    _getAxiosParams(opts) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    _getBaseUrl() {
      return "https://api.spotify.com/v1";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    getTrackNameWithArtists(track) {
      if (!track) {
        return "";
      }

      if (!track.artists || !track.artists[0]) {
        return `${track.name} [Unknown Artist]`;
      }

      const artists = track.artists.map((artist) => artist.name).join(", ");
      return `${track.name} [${artists}]`;
    },
    async _makeRequest(method, endpoint, params) {
      const config = {
        method,
        url: `${await this._getBaseUrl()}${endpoint}`,
        headers: await this._getHeaders(),
        params,
      };
      return await this.retry(config);
    },
    // Retry axios request if not successful
    async retry(config, retries = 3) {
      let response;
      try {
        response = await axios(config);
        return response;
      } catch (err) {
        if (retries <= 1) {
          throw new Error(err);
        }
        // if rate limit is exceeded, Retry-After will contain the # of seconds
        // to wait before retrying
        const delay = (response && response.status == 429)
          ? (response.headers["Retry-After"] * 1000)
          : 500;
        await pause(delay);
        return this.retry(config, retries - 1);
      }
    },
    async getItems(type, query) {
      if (!Object.values(ITEM_TYPES).includes(type)) {
        throw new Error("Invalid item type");
      }
      if (!query) {
        return null;
      }
      const res = await this._makeRequest("GET", `/search?type=${type}&limit=50&q=${encodeURI(query)}`);
      return lodash.get(res, `data.${ITEM_TYPES_RESULT_NAME[type]}.items`, null);
    },
    async getPlaylists() {
      const res = await this._makeRequest("GET", "/me/playlists");
      return lodash.get(res, "data.items", null);
    },
  },
};
