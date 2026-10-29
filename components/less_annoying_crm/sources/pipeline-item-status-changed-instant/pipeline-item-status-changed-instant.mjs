import common from "../common/pipeline-item.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "less_annoying_crm-pipeline-item-status-changed-instant",
  name: "New Lead or Pipeline Item Status Change (Instant)",
  description: "Emit new event when the status of a lead or other pipeline item changes in Less Annoying CRM. [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Advanced/UsingWebhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "PipelineItemStatus.Update";
    },
    getAction() {
      return "status changed";
    },
    getDedupeId(item) {
      return `${item.PipelineItemId}-${item.LastUpdate}`;
    },
  },
  sampleEmit,
};
