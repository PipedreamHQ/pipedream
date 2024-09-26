import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "oyster-new-engagement",
  name: "New Engagement",
  description: "Emit new event when a new engagement is added. [See the documentation](https://docs.oysterhr.com/reference/get_v1-engagements)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "modifiedAt";
    },
    getResourceFn() {
      return this.oyster.listEngagements;
    },
    generateMeta(engagement) {
      return {
        id: engagement.engagementId,
        summary: `New Engagement ${engagement.engagementId}`,
        ts: Date.parse(engagement.modifiedAt),
      };
    },
  },
  sampleEmit,
};
