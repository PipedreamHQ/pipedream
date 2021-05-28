const axios = require("axios");
const crypto = require("crypto");
const qs = require("qs");

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
      min: 1,
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
    _getParamsSerializer(p) {
      return (p) =>
        qs.stringify(p, {
          arrayFormat: "repeat",
        });
    },
    async _makeRequest(method, endpoint, params = {}) {
      const config = {
        method,
        url: `${this._getBaseUrl()}/${endpoint}`,
        headers: this._getHeaders(),
        params,
        paramsSerializer: this._getParamsSerializer(params),
      };
      return await axios(config);
    },
    // Uses Twitch API to create or delete webhook subscriptions.
    // Set mode to "subscribe" to create a webhook and "unsubscribe" to delete it.
    async manageHook(mode, url, topic, leaseSeconds, secretToken) {
      const data = {
        "hub.callback": url,
        "hub.mode": mode,
        "hub.topic": `${this._getBaseUrl()}/${topic}`,
        "hub.lease_seconds": leaseSeconds,
        "hub.secret": secretToken,
      };
      return await this._makeRequest("POST", "webhooks/hub", data);
    },
    verifyWebhookRequest(headers, bodyRaw, secretToken) {
      const [algorithm, expectedHash] = headers["x-hub-signature"].split("=");
      const hash = crypto
        .createHmac(algorithm, secretToken)
        .update(bodyRaw)
        .digest("hex");
      return expectedHash == hash;
    },
    async getClips(params) {
      return await this._makeRequest("GET", "clips", params);
    },
    async getGames(name = []) {
      let endpoint = "games";
      const params = {
        name,
      };
      return (await this._makeRequest("GET", encodeURI(endpoint), params)).data;
    },
    // gets all live streams that match the given parameters
    async getStreams(params) {
      return await this._makeRequest("GET", "streams", params);
    },
    async getUsers(login = []) {
      let endpoint = "users";
      const params = {
        login,
      };
      return (await this._makeRequest("GET", encodeURI(endpoint), params)).data;
    },
    async getUserFollows(params) {
      return await this._makeRequest("GET", "users/follows", params);
    },
    async getVideos(params) {
      return await this._makeRequest("GET", "videos", params);
    },
  },
};