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
      this._setPublishedAfter(publishedAfter || new Date());
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
    isRelevant() {
      return true;
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
    async paginateVideos(params) {
      const videos = await this.paginate({
        fn: this.youtubeDataApi.getVideos,
        params,
      });
      videos.forEach((video) => this.emitEvent({
        ...video,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      }));
      return videos[0]?.snippet?.publishedAt;
    },
    async paginatePlaylistItems(params, publishedAfter = null) {
      const videos = await this.paginate({
        fn: this.youtubeDataApi.getPlaylistItems,
        params,
        publishedAfter,
      });
      let lastPublished;
      for (const video of videos) {
        if (!lastPublished || Date.parse(video.snippet.publishedAt) > Date.parse(lastPublished)) {
          lastPublished = video.snippet.publishedAt;
          this.emitEvent(video);
        }
      }
      return lastPublished;
    },
    async paginate({
      fn, params, publishedAfter,
    }) {
      let totalResults, done, count = 0;;
      const results = [];
      do {
        const {
          data: {
            pageInfo, items, nextPageToken,
          },
        } = await fn(params);
        for (const item of items) {
          count++;
          if (this.isRelevant(item, publishedAfter)) {
            results.push(item);
            if (params.maxResults && results.length >= params.maxResults) {
              done = true;
              break;
            }
          }
        }
        params.pageToken = nextPageToken;
        totalResults = pageInfo.totalResults;
      } while ((count < totalResults) && params.pageToken && !done);
      return results;
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
