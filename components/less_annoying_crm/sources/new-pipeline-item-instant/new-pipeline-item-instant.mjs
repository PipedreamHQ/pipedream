import common from "../common/pipeline-item.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "less_annoying_crm-new-pipeline-item-instant",
  name: "New Lead or Pipeline Item (Instant)",
  description: "Emit new event when a lead or other pipeline item is created in Less Annoying CRM. [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Advanced/UsingWebhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "PipelineItemStatus.Create";
    },
    getAction() {
      return "created";
    },
  },
  sampleEmit,
};
