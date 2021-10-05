const axios = require("axios");
const { google } = require("googleapis");

module.exports = {
  type: "app",
  app: "youtube_data_api",
  propDefinitions: {
    maxResults: {
      type: "integer",
      label: "Maximum Results",
      description:
        "The maximum number of results in a channel to return. Should be divisible by 5 (ex. 5, 10, 15).",
      default: 20,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The video's title",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The video's description",
    },
    privacyStatus: {
      type: "string",
      label: "Privacy Status",
      description: "The video's privacy status",
      optional: true,
      options: [
        "private",
        "public",
        "unlisted",
      ],
    },
    publishAt: {
      type: "string",
      label: "Publish At",
      description: "The date and time when the video is scheduled to publish. If you set this, the Privacy Status must be set to `private`. Only available to Youtube Partner accounts.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of keyword tags associated with the video. Tags may contain spaces.",
      optional: true,
    },
    notifySubscribers: {
      type: "boolean",
      label: "Notify Subscribers",
      description: "Set to `true` if YouTube should send a notification about the new video to users who subscribe to the video's channel.",
      optional: true,
      default: true,
    },
  },
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
    /**
     * Returns an instance of the YouTube Data API authenticated with the user's access token
     *
     * @returns The instance of the YouTube Data API
     */
    youtube() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return google.youtube({
        version: "v3",
        auth,
      });
    },
    /**
     * Returns a collection of search results that match the query parameters specified in the API
     * request. By default, a search result set identifies matching video, channel, and playlist
     * resources.
     *
     * @param {Object} params - Parameters to be fed to the YouTube API call, as defined in [the API
     * docs](https://bit.ly/3uGXYss)
     * @returns A list of videos, channels, and/or playlists
     */
    async getVideos(params) {
      return await this._makeGetRequest("search", params);
    },
    /**
     * Returns channel resources that match the API request criteria
     *
     * @param {Object} params - Parameters to be fed to the YouTube API call, as defined in [the API
     * docs](https://bit.ly/3uHuaMm)
     * @returns A list of channels
     */
    async getChannels(params) {
      return await this._makeGetRequest("channels", params);
    },
    /**
     * Returns playlist item resources that match the API request criteria
     *
     * @param {Object} params - Parameters to be fed to the YouTube API call, as defined in [the API
     * docs](https://bit.ly/2YhZwgw)
     * @returns A list of playlist items
     */
    async getPlaylistItems(params) {
      return await this._makeGetRequest("playlistItems", params);
    },
    /**
     * Returns subscription resources that match the API request criteria
     *
     * @param {Object} params - Parameters to be fed to the YouTube API call, as defined in [the API
     * docs](https://bit.ly/3AeUzCy)
     * @returns A list of subscriptions
     */
    async getSubscriptions(params) {
      return await this._makeGetRequest("subscriptions", params);
    },
    /**
     * Uploads a video to YouTube and optionally sets the video's metadata
     *
     * @param {Sbject} opts - An object representing options used to upload a
     * video to YouTube
     * @param {String} opts.title - The video's title. The property value has a
     * maximum length of 100 characters and may contain all valid UTF-8
     * characters except < and >.
     * @param {String} opts.content - The file stream of the video to upload
     * @param {String} [opts.description] - The video's description. The
     * property value has a maximum length of 5000 bytes and may contain all
     * valid UTF-8 characters except < and >.
     * @param {String} [opts.privacyStats] - The video's privacy status. Either
     * `private`, `public`, or `unlisted`.
     * @param {String} [opts.publishAt] - The date and time when the video is
     * scheduled to publish. It can be set only if the privacy status of the
     * video is private. The value is specified in ISO 8601 format.
     * @param {String[]} [opts.tags] - A list of keyword tags associated with
     * the video. Tags may contain spaces. The property value has a maximum
     * length of 500 characters.
     * @param {Boolean} [opts.notifySubscribers] - The `notifySubscribers`
     * parameter indicates whether YouTube should send a notification about the
     * new video to users who subscribe to the video's channel. The default
     * value is true.
     * @param {...*} [extraOpts = {}] - Extra/optional parameters to be fed to
     * the YouTube API call, as defined in [the API
     * docs](https://bit.ly/3l6xhug)
    //  * @returns {Promise<youtube_v3.Schema$Video>} - The created video resource
     * @returns {Promise<import('googleapis').youtube_v3.Schema$Video>} The created video resource
     */
    async insertVideo(opts) {
      const {
        title,
        description,
        privacyStatus,
        publishAt,
        tags,
        notifySubscribers,
        content,
      } = opts;
      const youtube = await this.youtube();
      return await youtube.videos.insert({
        notifySubscribers,
        part: "snippet,status",
        requestBody: {
          snippet: {
            title,
            description,
            tags,
          },
          status: {
            privacyStatus,
            publishAt,
          },
        },
        media: {
          body: content,
        },
      });
    },
  },
};
