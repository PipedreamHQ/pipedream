const common = require("../common.js");

module.exports = {
  ...common,
  key: "hubspot-new-engagement",
  name: "New Engagement",
  description: "Emits an event for each new engagement created.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(engagement) {
      const { id, type, createdAt } = engagement.engagement;
      const ts = Date.parse(createdAt);
      return {
        id,
        summary: type,
        ts,
      };
    },
    emitEvent(engagement) {
      const meta = this.generateMeta(engagement);
      this.$emit(engagement, meta);
    },
    isRelevant(engagement, createdAfter) {
      return engagement.engagement.createdAt > createdAfter;
    },
  },
  async run(event) {
    const createdAfter = Date.parse(this.hubspot.monthAgo());
    const params = {
      limit: 250,
    };

    await this.paginateUsingHasMore(
      params,
      this.hubspot.getEngagements.bind(this),
      "results",
      createdAfter
    );
  },
};