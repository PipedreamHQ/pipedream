const youtube = require("../youtube.app.js");
const { promisify } = require("util");
const pause = promisify((delay, fn) => setTimeout(fn, delay));

module.exports = {
  props: {
    youtube,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the YouTube API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // every 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      const params = {
        ...this._getBaseParams(),
        maxResults: 10,
        ...this.getParams(),
      };
      const publishedAfter = await this.paginateVideos(params);
      if (publishedAfter) this._setPublishedAfter(publishedAfter);
      else this._setPublishedAfter(new Date());
    },
  },
  methods: {
    _getPublishedAfter() {
      return this.db.get("publishedAfter");
    },
    _setPublishedAfter(publishedAfter) {
      this.db.set("publishedAfter", publishedAfter);
    },
    _getBaseParams() {
      return {
        part: "snippet",
        type: "video",
        order: "date",
      };
    },
    /**
     * This method returns an object with specific parameters to be used when
     * searching videos in YouTube. See the [API
     * docs](https://developers.google.com/youtube/v3/docs/videos/list#parameters)
     * for more information about what the accepted parameters are.
     *
     * @returns an object containing parameters for videos search
     */
    getParams() {
      return {};
    },
    generateMeta(video) {
      const {
        id,
        snippet,
      } = video;
      return {
        id: id.videoId,
        summary: snippet.title,
        ts: Date.parse(snippet.publishedAt),
      };
    },
    emitEvent(result) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    },
    /**
     * Paginate through results from getVideos(), emit each video, and return the
     * most recent date that a video was published.
     *
     * @param {object} params - The parameters to pass into getVideos().
     * @returns a string of the most recent date that a video was published
     */
    async paginateVideos(params) {
      let count = 0;
      let totalResults = 1;
      let lastPublished;
      while (
        count < totalResults &&
        (!params.maxResults || count < params.maxResults)
      ) {
        const results = (await this.youtube.getVideos(params)).data;
        totalResults = results.pageInfo.totalResults;
        for (const video of results.items) {
          if (!lastPublished) lastPublished = video.snippet.publishedAt;
          this.emitEvent(video);
          count++;
        }
        if (!results.items || results.items.length < 1) break;
        if (!results.nextPageToken) break;
        else params.pageToken = results.nextPageToken;
      }
      return lastPublished;
    },

    /**
     * Paginate through item results from `resourceFn` and yield each item
     *
     * @param {Function} resourceFn - An async function that returns an object containing a list of
     * items and a `nextPageToken`
     * @param {Object} [params] - An object containing parameters to pass to `resourceFn`
     * @param {Number} [max] - The maximum number of items to yield
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
  },
  async run(/* event */) {
    let publishedAfter = this._getPublishedAfter();
    const params = {
      ...this._getBaseParams(),
      publishedAfter,
      ...this.getParams(),
    };
    publishedAfter = await this.paginateVideos(params);
    if (publishedAfter) this._setPublishedAfter(publishedAfter);
  },
};
