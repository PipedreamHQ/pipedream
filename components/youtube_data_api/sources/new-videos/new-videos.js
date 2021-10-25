const common = require("../common.js");

module.exports = {
  ...common,
  type: "source",
  key: "youtube_data_api-new-videos",
  name: "New Videos",
  description: "Emit new event for each new Youtube video the user posts.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    maxResults: {
      propDefinition: [
        common.props.youtube,
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
        forMine: true,
        maxResults: this.maxResults,
      };
    },
  },
  async run() {
    const params = {
      ...this._getBaseParams(),
      ...this.getParams(),
    };
    await this.paginateVideos(params);
  },
};
