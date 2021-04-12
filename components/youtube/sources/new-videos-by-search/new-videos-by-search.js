const common = require("../common.js");

module.exports = {
  ...common,
  key: "youtube-new-videos-by-search",
  name: "New Videos by Search",
  description:
    "Emits an event for each new YouTube video matching a search query.",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    ...common.props,
    q: {
      type: "string",
      label: "Search Query",
      description: "Search for new videos that match these keywords.",
    },
    maxResults: {
      propDefinition: [common.props.youtube, "maxResults"],
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