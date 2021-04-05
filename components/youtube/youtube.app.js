const axios = require("axios");

module.exports = {
  type: "app",
  app: "youtube_data_api",
  methods: {
    _getBaseUrl() {
      return "https://www.googleapis.com/youtube/v3/";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeGetRequest(endpoint, params) {
      return await axios.get(`${this._getBaseUrl()}${endpoint}`, {
        headers: this._getHeaders(),
        params,
      });
    },
    async getVideos(params) {
      return await this._makeGetRequest("search", params);
    },
    async getChannels(params) {
      return await this._makeGetRequest("channels", params);
    },
    async getPlaylistItems(params) {
      return await this._makeGetRequest("playlistItems", params);
    },
  },
};