import crypto from "crypto";
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
      // The record fetched after the webhook may already reflect a later change, so
      // key on the delivery: its MessageId (one payload can list several items) or,
      // if that is missing, the item's state as the payload reported it.
      // LastUpdate only has whole-second precision, so prefer NumberOfUpdates.
      const {
        messageId, payloadItem,
      } = this.getEventContext(item);
      const pick = (field) => payloadItem[field] ?? item[field];
      const eventKey = messageId
        ?? `${pick("StatusId")}-${pick("NumberOfUpdates") ?? pick("LastUpdate")}`;
      // Hashed because the raw IDs together exceed the 64-character dedupe limit.
      return crypto
        .createHash("sha256")
        .update(`${item.PipelineItemId}-${eventKey}`)
        .digest("hex");
    },
  },
  sampleEmit,
};
