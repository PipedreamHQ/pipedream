const axios = require("axios");

module.exports = {
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
