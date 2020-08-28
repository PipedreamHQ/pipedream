const axios = require("axios");

module.exports = {
  type: "app",
  app: "spotify",
  methods: {
    async getPlaylistItems(playlist_id, params) {
      return await axios.get(
        `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          },
          params,
        }
      );
    },

    async getPlaylists(params) {
      return await axios.get(
        "https://api.spotify.com/v1/me/playlists", 
        {
          headers: {
            Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          },
          params,
        }
      );
    },

    async getTracks(params) {
      return await axios.get(
        "https://api.spotify.com/v1/me/tracks", 
        {
          headers: {
            Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          },
          params,
        }
      );
    },
  },
};
