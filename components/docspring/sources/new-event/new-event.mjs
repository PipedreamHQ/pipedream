import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "docspring-new-event",
  name: "New Event (Instant)",
  description: "Emit new event when one of the chosen DocSpring events happens: a submission is created, processed, failed, declined, updated or expired;"
    + " a signature request is viewed, completed, declined or updated; a combined PDF or submission batch is processed or fails;"
    + " or a template, custom file or folder changes. Each event has `id`, `event_type`, `created_at` and the resource in `data`,"
    + " plus `resource_type` and `resource_id`. [See the documentation](https://docspring.com/docs/webhooks/payloads/#version-4)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  sampleEmit,
};
