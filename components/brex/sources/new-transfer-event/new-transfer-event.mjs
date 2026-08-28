// x-pd-ai: optimized
import common from "./common.mjs";
import brexApp from "../../brex.app.mjs";

export default {
  ...common,
  dedupe: "unique",
  type: "source",
  key: "brex-new-transfer-event",
  name: "New Transfer Event (Instant)",
  description: "Emit new event when a Brex transfer is processed or fails. Registers a Brex webhook subscription for the selected event types and emits the transfer's full details alongside the event payload. [See the documentation](https://developer.brex.com/openapi/webhooks_api/webhook-events/transferprocessedevent)",
  version: "0.1.2",
  props: {
    brexApp,
    ...common.props,
  },
};
