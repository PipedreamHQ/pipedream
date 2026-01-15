import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "aircall-new-tag-added",
  name: "New Tag Added",
  description: "Emit new event when a tag is added to a call",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      let page = 1;
      let total, count = 0;
      const callsWithTags = [];

      do {
        const {
          calls, meta,
        } = await this.aircall.listCalls({
          order: "desc",
          page,
        });

        total = meta.total; // total number of results
        count += calls.length;  // count of results processed so far
        page++;

        const withTags = calls.filter((call) => call.tags?.length > 0);
        callsWithTags.push(...withTags);

      } while (count < total && callsWithTags.length < 25);

      return callsWithTags;
    },
    getEventType() {
      return "call.tagged";
    },
    generateMeta(call) {
      const tags = JSON.stringify(call.tags.map((tag) => tag.id));
      return {
        id: `${call.id}${tags}`,
        summary: call.raw_digits,
        ts: Date.now(),
      };
    },
  },
};
