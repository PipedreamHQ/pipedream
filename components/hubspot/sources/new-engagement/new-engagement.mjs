import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-engagement",
  name: "New Engagement",
  description: "Emit new event for each new engagement created. This action returns a maximum of 5000 records at a time, make sure you set a correct time range so you don't miss any events",
  version: "0.0.17",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    getTs(engagement) {
      return Date.parse(engagement.createdAt);
    },
    generateMeta(engagement) {
      const {
        id,
        type,
      } = engagement.engagement;
      const ts = this.getTs(engagement.engagement);
      return {
        id,
        summary: type,
        ts,
      };
    },
    isRelevant(engagement, createdAfter) {
      return this.getTs(engagement.engagement) > createdAfter;
    },
  },
  async run() {
    const createdAfter = this._getAfter();
    const params = {
      limit: 250,
    };

    await this.paginateUsingHasMore(
      params,
      this.hubspot.getEngagements.bind(this),
      "results",
      createdAfter,
      20,
    );
  },
};
