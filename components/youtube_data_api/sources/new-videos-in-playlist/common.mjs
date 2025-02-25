import common from "../common/common.mjs";

export default {
  ...common,
  hooks: {
    ...common.hooks,
    deploy() {},
  },
  props: {
    ...common.props,
    playlistId: {
      type: "string",
      label: "Playlist ID",
      description: "The ID of the playlist to search for new videos in. E.g. `PLJswo-CV0rmm19_Xi5_NlGJzRbnyp43c_`. When viewing the playlist in a browser, the playlistId is the part of the URL that comes after \"list=\"",
    },
  },
  methods: {
    ...common.methods,
    generateMeta(video) {
      const {
        id,
        snippet,
      } = video;
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
  },
  async run() {
    const publishedAfter = this._getPublishedAfter();
    const params = {
      ...this.getParams(),
    };

    const lastPublished = await this.paginatePlaylistItems(
      params,
      publishedAfter,
    );

    if (lastPublished) this._setPublishedAfter(lastPublished);
  },
};
