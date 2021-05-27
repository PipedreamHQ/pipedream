const common = require("../common.js");

module.exports = {
  ...common,
  key: "youtube-new-videos",
  name: "New Videos",
  description: "Emits an event for each new Youtube video the user posts.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
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
        forMine: true,
        maxResults: this.maxResults,
      };
    },
  },
  async run(event) {
    const params = {
      ...this._getBaseParams(),
      ...this.getParams(),
    };
    await this.paginateVideos(params);
  },
};