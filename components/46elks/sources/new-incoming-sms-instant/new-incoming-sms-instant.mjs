import { axios } from "@pipedream/platform";
import elksApp from "../../46elks.app.mjs";

export default {
  key: "46elks-new-incoming-sms-instant",
  name: "New Incoming SMS (Instant)",
  description: "Emit new event instantly when an SMS is received by a specific number linked to your 46elks account. [See the documentation](https://46elks.com/docs/receive-sms)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    elksApp,
    number: {
      propDefinition: [
        elksApp,
        "number",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Since this source emits events for new incoming SMS only, there's no need to emit historical data.
    },
    async activate() {
      // No webhook activation needed, as 46elks doesn't support webhook creation via API
    },
    async deactivate() {
      // No webhook deactivation needed, as 46elks doesn't support webhook deletion via API
    },
  },
  async run(event) {
    const { body } = event;

    // Validate the incoming number
    if (body.to !== this.number) {
      this.http.respond({
        status: 404,
        body: "Number not found",
      });
      return;
    }

    // Emit the event
    this.$emit(body, {
      id: body.id || `${body.from}-${Date.now()}`,
      summary: `New SMS from ${body.from}: ${body.message}`,
      ts: body.time
        ? Date.parse(body.time)
        : Date.now(),
    });

    // Respond to the HTTP request
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
