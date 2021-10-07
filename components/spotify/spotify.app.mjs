import { axios as axiosPipedream } from "@pipedream/platform";
import axios from "axios";
import lodash from "lodash";
import { promisify } from "util";
const pause = promisify((delay, fn) => setTimeout(fn, delay));

export default {
  type: "app",
  app: "spotify",
  propDefinitions: {
    artistId: {
      type: "string",
      label: "ID",
      description: "The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the artist. For example: `43ZHCT0cAZBISjO8DG9PnE`.",
      useQuery: true,
      async options({ query }) {
        const artists = await this.getArtists(query);
        if (!artists) {
          return [];
        }

        return artists.map((artist) => ({
          label: artist.name,
          value: artist.id,
        }));
      },
    },
    playlistId: {
      type: "string",
      label: "Playlist ID",
      description: "The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the playlist",
      async options() {
        const playlists = await this.getPlaylists();
        if (!playlists) {
          return [];
        }

        return playlists.map((playlist) => ({
          label: playlist.name,
          value: playlist.id,
        }));
      },
    },
    playlists: {
      type: "string[]",
      label: "Playlist",
      description: "Search for new tracks added to the specified playlist(s).",
      async options({ prevContext }) {
        const limit = 20;
        const offset = prevContext.offset
          ? prevContext.offset
          : 0;
        const { data } = await this.getPlaylists({
          limit,
          offset,
        });
        const options = data.items.map((playlist) => {
          return {
            label: playlist.name,
            value: playlist.id,
          };
        });
        return {
          options,
          context: {
            offset: offset + limit,
          },
        };
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.spotify.com/v1";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest($, opts) {
      return this.retry($, {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      });
    },
    // Retry axios request if not successful
    async retry($, opts, retries = 3) {
      let response;
      try {
        response = await axiosPipedream($, opts);
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
        return this.retry($, opts, retries - 1);
      }
    },
    async getPlaylistItems(params) {
      const { playlistId } = params;
      return this._makeRequest("GET", `/playlists/${playlistId}/tracks`, params);
    },
    /* async getPlaylists(params) {
      return this._makeRequest("GET", "/me/playlists", params);
    }, */
    async getTracks(params) {
      return this._makeRequest("GET", "/me/tracks", params);
    },
    async getArtists(query) {
      if (!query) {
        return [];
      }
      const url = this._getBaseUrl() + `/search?type=artist&limit=50&q=${encodeURI(query)}`;
      const res = await axios.get(url, {
        headers: this._getHeaders(),
      });

      return lodash.get(res, "data.artists.items", null);
    },
    async getPlaylists() {
      const url = this._getBaseUrl() + "/me/playlists";
      const res = await axios.get(url, {
        headers: this._getHeaders(),
      });

      return lodash.get(res, "data.items", null);
    },
  },
};
