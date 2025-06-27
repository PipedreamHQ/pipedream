import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "veedea-new-campaign-created",
  name: "New Campaign Created",
  description: "Emit new event when a new campaign is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.veedea.listCampaigns;
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Campaign Created: ${item.camp_name}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
