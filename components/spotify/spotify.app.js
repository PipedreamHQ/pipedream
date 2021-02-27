const axios = require("axios");
const { promisify } = require("util");
const pause = promisify((delay, fn) => setTimeout(fn, delay));

module.exports = {
  type: "app",
  app: "spotify",
  propDefinitions: {
    playlists: {
      type: "string[]",
      label: "Playlist",
      description: "Search for new tracks added to the specified playlist(s).",
      async options({ prevContext }) {
        const limit = 20;
        const offset = prevContext.offset ? prevContext.offset : 0;
        const { data } = await this.getPlaylists({ limit, offset });
        const options = data.items.map((playlist) => {
          return { label: playlist.name, value: playlist.id };
        });
        return {
          options,
          context: { offset: offset+limit },
        };
      },
    },
  },
  methods: {
    async _getBaseUrl() {
      return "https://api.spotify.com/v1"
    },
    async _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest(method, endpoint, params) {
      config = {
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
      } catch(err) {
        if (retries <= 1) {
          throw new Error(err);
        }
        // if rate limit is exceeded, Retry-After will contain the # of seconds to wait before retrying
        const delay = (response && response.status == 429) ? (response.headers['Retry-After']*1000) : 500;
        await pause(delay);
        return await this.retry(config, retries - 1);
      }
    },
    async getPlaylistItems(params) {
      const { playlistId } = params;
      return await this._makeRequest("GET", `/playlists/${playlistId}/tracks`, params);
    },
    async getPlaylists(params) {
      return await this._makeRequest("GET", `/me/playlists`, params);
    },

    async getTracks(params) {
      return await this._makeRequest("GET", `/me/tracks`, params);
    },
  },
};
