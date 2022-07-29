import youtube from "@googleapis/youtube";
import { toArray } from "./utils.mjs";
import { promisify } from "util";
const pause = promisify((delay, fn) => setTimeout(fn, delay));

export default {
  type: "app",
  app: "youtube_data_api",
  propDefinitions: {
    useCase: {
      label: "Use Case",
      description: "Select your use case to render the next properties.",
      type: "string",
      reloadProps: true,
    },
    playlistId: {
      label: "Playlist Id",
      description: "The playlistId parameter specifies a unique YouTube playlist ID.",
      type: "string",
    },
    channelId: {
      label: "Channel Id",
      description: "The channelId parameter specifies a unique YouTube channel ID.",
      type: "string",
    },
    part: {
      label: "Part",
      description: "The part parameter specifies a comma-separated list of one or more resource properties that the API response will include.",
      type: "string[]",
    },
    regionCode: {
      label: "Region Code",
      description: "The regionCode parameter instructs the API to return results for the specified country. The parameter value is an ISO 3166-1 alpha-2 country code. For example: US, GB, BR",
      type: "string",
      optional: true,
    },
    hl: {
      label: "Language",
      description: "The language parameter instructs the API to retrieve localized resource metadata for a specific application language that the YouTube website supports.",
      type: "string",
      optional: true,
      async options() {
        return await this.listI18nLanguagesOpts();
      },
    },
    onBehalfOfContentOwner: {
      label: "On Behalf Of Content Owner",
      description: "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.",
      type: "string",
      optional: true,
    },
    onBehalfOfContentOwnerChannel: {
      label: "On Behalf Of Content Owner Channel",
      description: "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.",
      type: "string",
      optional: true,
    },
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
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the video file you want to upload to YouTube. Must specify either **File URL** or **File Path**.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "Path to the video file to upload (e.g., `/tmp/myVideo.mp4`). Must specify either **File URL** or **File Path**.",
      optional: true,
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
      description: "The date and time when the video is scheduled to publish. If you set this, the **Privacy Status** must be set to `private`. Only available to Youtube Partner accounts.",
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
    /**
     * Returns an instance of the YouTube Data API authenticated with the user's access token
     *
     * @returns The instance of the YouTube Data API
     */
    youtube() {
      const auth = new youtube.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return youtube.youtube({
        version: "v3",
        auth,
      });
    },
    /**
     * Returns a new Date object with date corresponding to `days` days ago
     *
     * @param {Number} days - The number of days ago
     * @returns The Date of `days` days ago
     */
    daysAgo(days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return daysAgo;
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
      const youtube = await this.youtube();
      return await youtube.search.list(params);
    },
    /**
     * Returns a collection of video results that match the parameters specified in the API
     * request.
     *
     * @param {Object} params - Parameters to be fed to the YouTube API call, as defined in [the API
     * docs](https://bit.ly/3uGXYss)
     * @returns A list of videos
     */
    async listVideos(params) {
      const youtube = await this.youtube();
      return await youtube.videos.list(params);
    },
    /**
     * Returns a collection of channels that match the parameters specified in the API
     * request.
     *
     * @param {Object} params - Parameters to be fed to the YouTube API call
     * @returns A list of channels
     */
    async listChannels(params) {
      const youtube = await this.youtube();
      return await youtube.channels.list(params);
    },
    /**
     * Returns a collection of activities that match the parameters specified in the API
     * request.
     *
     * @param {Object} params - Parameters to be fed to the YouTube API call
     * @returns A list of activities
     */
    async listActivities(params) {
      const youtube = await this.youtube();
      return await youtube.activities.list(params);
    },
    /**
    * Returns a collection of playlists results that match the parameters specified in the API
    * request.
    *
    * @param {Object} params - Parameters to be fed to the YouTube API call
    * @returns A list of playlists
    */
    async listPlaylists(params) {
      const youtube = await this.youtube();
      return await youtube.playlists.list(params);
    },
    /**
     * Modifies a playlist. For example, you could change a playlist's title, description,
     * or privacy status.
     *
     * @param {Object} params - Parameters to be fed to the YouTube API call
     * @returns A playlist
     */
    async updatePlaylist(params) {
      const youtube = await this.youtube();
      return await youtube.playlists.update(params);
    },
    /**
     * Returns a collection of video categories mapped to pipedream's options
     * @returns A list of videos categories
     */
    async listVideoCategoriesOpts(regionCode) {
      if (!regionCode || regionCode.length !== 2) {
        return [];
      }
      const youtube = await this.youtube();
      const categories = (await youtube.videoCategories.list({
        part: "snippet",
        regionCode: regionCode,
      })).data.items;
      const opts = categories.map((category) => ({
        label: category.snippet.title,
        value: category.id,
      }));
      return opts;
    },
    /**
     * Returns a collection of languages mapped to pipedream's options
     * @returns A list of languages
     */
    async listI18nLanguagesOpts() {
      const youtube = await this.youtube();
      const languages = (await youtube.i18nLanguages.list({
        part: "snippet",
      })).data.items;
      const opts = languages.map((language) => ({
        label: language.snippet.name,
        value: language.id,
      }));
      return opts;
    },
    /**
     * Returns channel resources that match the API request criteria
     *
     * @param {Object} params - Parameters to be fed to the YouTube API call, as defined in [the API
     * docs](https://bit.ly/3uHuaMm)
     * @returns A list of channels
     */
    async getChannels(params) {
      const youtube = await this.youtube();
      return await youtube.channels.list(params);
    },
    /**
     * Returns playlist item resources that match the API request criteria
     *
     * @param {Object} params - Parameters to be fed to the YouTube API call, as defined in [the API
     * docs](https://bit.ly/2YhZwgw)
     * @returns A list of playlist items
     */
    async getPlaylistItems(params) {
      const youtube = await this.youtube();
      return await youtube.playlistItems.list(params);
    },
    /**
     * Returns subscription resources that match the API request criteria
     *
     * @param {Object} params - Parameters to be fed to the YouTube API call, as defined in [the API
     * docs](https://bit.ly/3AeUzCy)
     * @returns A list of subscriptions
     */
    async getSubscriptions(params) {
      const youtube = await this.youtube();
      return await youtube.subscriptions.list(params);
    },
    /**
     * Paginate through item results from `resourceFn` and yield each item
     *
     * @param {Function} resourceFn - An async function that returns an object containing a list of
     * items and a `nextPageToken`
     * @param {Object} [params] - An object containing parameters to pass to `resourceFn`
     * @param {Number} [max=null] - The maximum number of items to yield
     * @returns {void}
     */
    async *paginate(resourceFn, params, max = null) {
      let done = false;
      let count = 0;
      do {
        const {
          items,
          nextPageToken,
        } = await this.retryFn(resourceFn,
          params);
        for (const item of items) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        // pass cursor to get next page of results; if no cursor, no more pages
        params.pageToken = nextPageToken;
        done = !nextPageToken;
      } while (!done);
    },
    /**
     * Paginate through item results from `resourceFn` and yield each item
     *
     * @param {Function} resourceFn - An async function that returns an object containing a list of
     * items and a `nextPageToken`
     * @param {Object} [params] - An object containing parameters to pass to `resourceFn`
     * @param {Number} [max] - The maximum number of items to yield
     * @param {Function(Object): Boolean} [condition] - A function called with each item that
     * returns `true` to stop pagination
     * @returns {Object|void} The item passing the condition to stop paginating
     */
    async *paginateUntil(resourceFn, params, max, condition) {
      const items = this.paginate(resourceFn, params, max);
      for await (const item of items) {
        if (condition && condition(item)) {
          return item;
        }
        yield item;
      }
    },
    /**
     * Retry the call to `resourceFn` up to `retries` times in the event of an error
     *
     * @param {Function} resourceFn - An async function to call with `params`
     * @param {Object} params - An object containing params to pass as an argument to `resourceFn`
     * @param {Number} [retries=3] - The maximum number of times to retry the function call
     * @returns The result of the call to `resourceFn`
     */
    async retryFn(resourceFn, params, retries = 3) {
      let response;
      try {
        response = await resourceFn(params);
        return response.data;
      } catch (err) {
        if (retries <= 1) {
          throw new Error(err);
        }
        const delay = response
          ? response.headers["ratelimit-limit"]
          : 500;
        await pause(delay);
        return await this.retryFn(resourceFn, params, retries - 1);
      }
    },

    /**
     * Paginate through item results from `resourceFn` and return a list of all items
     *
     * @param {Function} resourceFn - An async function that returns an object containing a list of
     * items and a `nextPageToken`
     * @param {Object} [params] - An object containing parameters to pass to `resourceFn`
     * @param {Number} [max=null] - The maximum number of items to yield, or unlimited if `null`
     * @returns {Array} - The list of items
     */
    async listAll(resourceFn, params, max) {
      return await toArray(this.paginate(resourceFn, params, max));
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
     * @returns {Promise<import('@googleapis/youtube').youtube_v3.Schema$Video>}
     * The created video resource
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
