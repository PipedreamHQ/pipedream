import common from "../common.mjs";

export default {
  ...common,
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
