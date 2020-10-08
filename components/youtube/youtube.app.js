const axios = require("axios");

module.exports = {
  type: "app",
  app: "youtube_data_api",
  methods: {
    async getVideos(params) {
      return await axios.get("https://www.googleapis.com/youtube/v3/search", {
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        params,
      });
    },
    async getChannels(params) {
      return await axios.get("https://www.googleapis.com/youtube/v3/channels", {
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        params,
      });
    },
    async getPlaylistItems(params) {
      return await axios.get(
        "https://www.googleapis.com/youtube/v3/playlistItems",
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
