import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-liked-videos",
  name: "New Liked Videos",
  description: "Emit new event for each new Youtube video liked by the authenticated user.",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
    deploy() {},
  },
  props: {
    ...common.props,
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
    isRelevant() {
      return true;
    },
  },
  async run() {
    const params = {
      part: "contentDetails,id,snippet,status",
      playlistId: "LL",
      maxResults: this.maxResults,
    };
    await this.paginatePlaylistItems(params);
  },
};
