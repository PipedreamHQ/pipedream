const common = require("../common.js");

module.exports = {
  ...common,
  key: "youtube-new-videos-in-playlist",
  name: "New Videos in Playlist",
  description: "Emits an event for each new Youtube video added to a Playlist.",
  version: "0.0.3",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
    deploy() {},
  },
  props: {
    ...common.props,
    playlistId: {
      type: "string",
      label: "Playlist ID",
      description: "The ID of the playlist to search for new videos in.",
    },
    maxResults: {
      propDefinition: [common.props.youtube, "maxResults"],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(video) {
      const { id, snippet } = video;
      return {
        id,
        summary: snippet.title,
        ts: Date.parse(snippet.publishedAt),
      };
    },
    getParams() {
      return {
        part: "contentDetails,id,snippet,status",
        playlistId: this.playlistId,
        maxResults: this.maxResults,
      };
    },
    isRelevant(video, publishedAfter) {
      if (!publishedAfter) return true;
      const publishedAt = video.snippet.publishedAt;
      return Date.parse(publishedAt) > Date.parse(publishedAfter);
    },
    async paginatePlaylistItems(params, publishedAfter = null) {
      let totalResults = 1;
      let count = 0;
      let countEmitted = 0;
      let lastPublished;

      while (count < totalResults && countEmitted < params.maxResults) {
        const results = (await this.youtube.getPlaylistItems(params)).data;
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
  async run(event) {
    const publishedAfter = this._getPublishedAfter();
    const params = {
      ...this.getParams(),
    };

    const lastPublished = await this.paginatePlaylistItems(
      params,
      publishedAfter
    );

    if (lastPublished) this._setPublishedAfter(lastPublished);
  },
};