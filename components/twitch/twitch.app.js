const axios = require("axios");
const crypto = require("crypto");

module.exports = {
  type: "app",
  app: "twitch",
  propDefinitions: {
    streamerLoginNames: {
      type: "string[]",
      label: "Streamer Login Names",
      description:
        "Enter the login names of the streamers whose streams you want to watch.",
    },
    game: {
      type: "string",
      label: "Game Title",
      description: "Watch for live streams about the specified game.",
    },
    language: {
      type: "string",
      label: "Stream Language",
      description:
        'Watch for games streamed in the specified language. A language value must be either the ISO 639-1 two-letter code for a supported stream language or "other".',
    },
    max: {
      type: "integer",
      label: "Max Items",
      description:
        "The maximum number of items to return at one time. Streams are returned sorted by number of viewers, in descending order. Videos and Clips are returned sorted by publish date.",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.twitch.tv/helix";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        "client-id": this.$auth.oauth_client_id,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest(method, endpoint, params = null) {
      const config = {
        method,
        url: `${this._getBaseUrl()}/${endpoint}`,
        headers: this._getHeaders(),
      };
      if (params) config.params = params;
      return await axios(config);
    },
    // Uses Twitch API to create or delete webhook subscriptions.
    // Set mode to "subscribe" to create a webhook and "unsubscribe" to delete it.
    async manageHook(mode, url, topic, leaseSeconds) {
      const data = {
        "hub.callback": url,
        "hub.mode": mode,
        "hub.topic": `${this._getBaseUrl()}/${topic}`,
        "hub.lease_seconds": leaseSeconds,
        "hub.secret": this.$auth.oauth_access_token,
      };
      return await this._makeRequest("POST", "webhooks/hub", data);
    },
    verifyWebhookRequest(headers, body) {
      var hubSecret = headers["x-hub-signature"].split("=");
      const hash = crypto
        .createHmac(hubSecret[0], this.$auth.oauth_access_token)
        .update(JSON.stringify(body))
        .digest("hex");
      return hubSecret[1] == hash;
    },
    async getClips(params) {
      return (await this._makeRequest("GET", "clips", params)).data;
    },
    async getGames(names = []) {
      let endpoint = "games";
      if (names.length > 0) {
        endpoint += "?";
        for (const name of names) endpoint += `name=${name}&`;
        endpoint = endpoint.slice(0, -1);
      }
      return (await this._makeRequest("GET", encodeURI(endpoint))).data;
    },
    // gets all live streams that match the given parameters
    async getStreams(params) {
      return (await this._makeRequest("GET", "streams", params)).data;
    },
    async getSubscriptions(params) {
      return (await this._makeRequest("GET", "subscriptions", params)).data;
    },
    async getUsers(loginNames = []) {
      let endpoint = "users";
      if (loginNames.length > 0) {
        endpoint += "?";
        for (const name of loginNames) endpoint += `login=${name}&`;
        endpoint = endpoint.slice(0, -1);
      }
      return (await this._makeRequest("GET", encodeURI(endpoint))).data;
    },
    async getUserFollows(params) {
      return (await this._makeRequest("GET", "users/follows", params)).data;
    },
    async getVideos(params) {
      return (await this._makeRequest("GET", "videos", params)).data;
    },
  },
};