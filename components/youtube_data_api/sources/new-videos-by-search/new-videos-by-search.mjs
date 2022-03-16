import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-videos-by-search",
  name: "New Videos by Search",
  description:
    "Emit new event for each new YouTube video matching a search query.",
  version: "0.0.6",
  dedupe: "unique",
  props: {
    ...common.props,
    q: {
      type: "string",
      label: "Search Query",
      description: "Search for new videos that match these keywords.",
    },
    maxResults: {
      propDefinition: [
        common.props.youtubeDataApi,
        "maxResults",
      ],
    },
  },
  hooks: {
    ...common.hooks,
    deploy() {},
  },
  methods: {
    ...common.methods,
    getParams() {
      return {
        q: this.q,
        maxResults: this.maxResults,
      };
    },
  },
};
