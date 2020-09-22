const axios = require("axios");

const spotify = {
  type: "app",
  app: "spotify",
  methods: {
    async _getBaseUrl() {
      return "https://api.spotify.com/v1"
    },
    async _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async getPlaylistItems(playlist_id, params) {
      return await axios.get(
        `${await this._getBaseUrl()}/playlists/${playlist_id}/tracks`,
        {
          headers: await this._getHeaders(),
          params,
        }
      );
    },

    async getPlaylists(params) {
      return await axios.get(
        `${await this._getBaseUrl()}/me/playlists`, 
        {
          headers: await this._getHeaders(),
          params,
        }
      );
    },

    async getTracks(params) {
      return await axios.get(
        `${await this._getBaseUrl()}/me/tracks`, 
        {
          headers: await this._getHeaders(),
          params,
        }
      );
    },
  },
};


//const spotify = require("https://github.com/PipedreamHQ/pipedream/components/spotify/spotify.app.js");

module.exports = {
  name: "New Playlists",
  description:
    "Emits an event for each new playlist owned or followed by the current Spotify user.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    spotify,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let results;
    let total = 1;
    let count = 0;
    let limit = 20;
    let offset = 0;

    let params = {
      limit,
      offset,
    };

    while (count < total) {
      results = await this.spotify.getPlaylists(params);
      total = results.data.total;
      for (const playlist of results.data.items) {
        this.$emit(playlist, {
          id: playlist.id,
          summary: playlist.name,
          ts: Date.now(),
        });
        count++;
      }
      params.offset += limit;
    }
  },
};