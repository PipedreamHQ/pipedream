import { v4 as uuid } from "uuid";
import app from "../../easyly.app.mjs";

export default {
  key: "easyly-new-event-triggered-instant",
  name: "New Event Triggered (Instant)",
  description: "Emit new event when an action is triggered in network leads. After creating the source, you need to [register a Webhook on Easyly](https://app.easyly.com/settings/developers) using the source's HTTP Endpoint. [See the documentation](https://api.easyly.com/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
  },
  async run(event) {
    const { body } = event;
    const eventType = body.type;

    this.$emit(body, {
      id: uuid(),
      summary: `New Event: ${eventType}`,
      ts: Date.now(),
    });
  },
};
