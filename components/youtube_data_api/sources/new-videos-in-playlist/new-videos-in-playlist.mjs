import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-videos-in-playlist",
  name: "New Videos in Playlist",
  description: "Emit new event for each new Youtube video added to a Playlist.",
  version: "0.0.7",
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
      propDefinition: [
        common.props.youtubeDataApi,
        "maxResults",
      ],
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
