import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the YouTube API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
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
        const results = (await this.youtubeDataApi.getVideos(params)).data;
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
    async paginatePlaylistItems(params, publishedAfter = null) {
      let totalResults = 1;
      let count = 0;
      let countEmitted = 0;
      let lastPublished;

      while (count < totalResults && countEmitted < params.maxResults) {
        const results = (await this.youtubeDataApi.getPlaylistItems(params)).data;
        totalResults = results.pageInfo.totalResults;
        for (const video of results.items) {
          if (this.isRelevant(video, publishedAfter)) {
            if (
              !lastPublished ||
              Date.parse(video.snippet.publishedAt) > Date.parse(lastPublished)
            )
              lastPublished = video.snippet.publishedAt;
            this.emitEvent(video);
            countEmitted++;
          }
          count++;
        }
        params.pageToken = results.nextPageToken;
      }
      return lastPublished;
    },
  },
  async run() {
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
