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
      description: "",
    },
    description: {
      type: "string",
      label: "Description",
      description: "",
    },
    privacyStatus: {
      type: "string",
      label: "Privacy Status",
      description: "",
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
      description: "Only available to Youtube Partner accounts. If you set this, the Privacy Status must be set to \"private.\"",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "",
      optional: true,
    },
    notifySubscribers: {
      type: "boolean",
      label: "Notify Subscribers",
      description: "",
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
    // Returns a drive object authenticated with the user's access token
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
    async getVideos(params) {
      return await this._makeGetRequest("search", params);
    },
    async getChannels(params) {
      return await this._makeGetRequest("channels", params);
    },
    async getPlaylistItems(params) {
      return await this._makeGetRequest("playlistItems", params);
    },
    /**
     * Uploads a video to YouTube and optionally sets the video's metadata
     *
     * @param {Sbject} opts - an object representing options used to upload a
     * video to YouTube
     * @param {String} opts.title - the video's title. The property value has a
     * maximum length of 100 characters and may contain all valid UTF-8
     * characters except < and >.
     * @param {String} opts.content - the file stream of the video to upload
     * @param {String} [opts.description] - the video's description. The
     * property value has a maximum length of 5000 bytes and may contain all
     * valid UTF-8 characters except < and >.
     * @param {String} [opts.privacyStats] - the video's privacy status. Either
     * `private`, `public`, or `unlisted`.
     * @param {String} [opts.publishAt] - the date and time when the video is
     * scheduled to publish. It can be set only if the privacy status of the
     * video is private. The value is specified in ISO 8601 format.
     * @param {String[]} [opts.tags] - a list of keyword tags associated with
     * the video. Tags may contain spaces. The property value has a maximum
     * length of 500 characters.
     * @param {Boolean} [opts.notifySubscribers] - the `notifySubscribers`
     * parameter indicates whether YouTube should send a notification about the
     * new video to users who subscribe to the video's channel. The default
     * value is true.
     * @param {...*} [extraOpts = {}] - extra/optional parameters to be fed to
     * the YouTube API call, as defined in [the API
     * docs](https://bit.ly/3l6xhug)
    //  * @returns {Promise<youtube_v3.Schema$Video>} - The created video resource
     * @returns {Promise<import('googleapis').youtube_v3.Schema$Video>} - The created video resource
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
