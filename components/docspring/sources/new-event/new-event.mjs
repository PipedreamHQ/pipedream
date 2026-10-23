import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "docspring-new-event",
  name: "New Event (Instant)",
  version: "0.0.1",
  description:
    "Emit an event when a subscribed DocSpring event occurs — submission processed/failed/created/expired, data request completed/viewed, combined submission or batch processed/failed, or a template created/updated/deleted. [See the documentation](https://docspring.com/docs).",
  type: "source",
  dedupe: "unique",
  sampleEmit,
};
