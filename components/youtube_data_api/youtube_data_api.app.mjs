import youtube from "@googleapis/youtube";
import { toArray } from "./utils.mjs";
import { promisify } from "util";
const pause = promisify((delay, fn) => setTimeout(fn, delay));

export default {
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
