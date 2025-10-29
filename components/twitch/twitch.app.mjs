import { axios } from "@pipedream/platform";
import crypto from "crypto";
import qs from "qs";

export default {
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
        "Watch for games streamed in the specified language. A language value must be either the ISO 639-1 two-letter code for a supported stream language or \"other\".",
    },
    max: {
      type: "integer",
      label: "Max Items",
      description:
        "The maximum number of items to return at one time. Streams are returned sorted by number of viewers, in descending order. Videos and Clips are returned sorted by publish date.",
      min: 1,
    },
    user: {
      type: "string",
      label: "User ID",
    },
    broadcaster: {
      type: "string",
      label: "Broadcaster Id",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.twitch.tv/helix";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "client-id": this.$auth.oauth_client_id,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest(method, endpoint, params = {}, $ = this) {
      const config = {
        method,
        url: `${this._getBaseUrl()}/${endpoint}`,
        headers: this._getHeaders(),
        params,
        paramsSerializer: function (params) {
          return qs.stringify(params, {
            arrayFormat: "brackets",
          });
        },
        returnFullResponse: true,
      };
      return axios($, config);
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
      const [
        algorithm,
        expectedHash,
      ] = headers["x-hub-signature"].split("=");
      const hash = crypto
        .createHmac(algorithm, secretToken)
        .update(bodyRaw)
        .digest("hex");
      return expectedHash == hash;
    },
    async blockUser(params) {
      return await this._makeRequest("PUT", "users/blocks", params);
    },
    async checkUserSubscription(params) {
      return await this._makeRequest("GET", "subscriptions/user", params);
    },
    async deleteVideo(params) {
      return await this._makeRequest("DELETE", "videos", params);
    },
    async getBroadcasterSubscriptions(params) {
      return await this._makeRequest("GET", "subscriptions", params);
    },
    async getChannelEditors(params) {
      return await this._makeRequest("GET", "channels/editors", params);
    },
    async getChannelInformation(params) {
      return await this._makeRequest("GET", "channels", params);
    },
    async getChannelTeams(params) {
      return await this._makeRequest("GET", "teams/channel", params);
    },
    async getClips(params) {
      return await this._makeRequest("GET", "clips", params);
    },
    async getEmoteSets(params) {
      return await this._makeRequest("GET", "chat/emotes/set", params);
    },
    async getGames(name = []) {
      let endpoint = "games";
      const params = {
        name,
      };
      return (await this._makeRequest("GET", encodeURI(endpoint), params)).data;
    },
    async getMultipleUsers(params) {
      return await this._makeRequest("GET", "users", params);
    },
    // gets all live streams that match the given parameters
    async getStreams(params) {
      return await this._makeRequest("GET", "streams", params);
    },
    async getTopGames() {
      return await this._makeRequest("GET", "games/top");
    },
    async getUsers(login = []) {
      let endpoint = "users";
      const params = {
        login,
      };
      return (await this._makeRequest("GET", encodeURI(endpoint), params)).data;
    },
    async getUserFollows(params) {
      return await this._makeRequest("GET", "channels/followers", params);
    },
    async getUserSubscriptions(params) {
      return await this._makeRequest("GET", "subscriptions", params);
    },
    async getFollowedChannels(params) {
      return await this._makeRequest("GET", "channels/followed", params);
    },
    async getVideos(params) {
      return await this._makeRequest("GET", "videos", params);
    },
    async searchChannels(params) {
      return await this._makeRequest("GET", "search/channels", params);
    },
    async searchGames(params) {
      return await this._makeRequest("GET", "search/categories", params);
    },
    async unblockUser(params) {
      return await this._makeRequest("DELETE", "users/blocks", params);
    },
    async updateChannel(params) {
      return await this._makeRequest("PATCH", "channels", params);
    },
  },
};
