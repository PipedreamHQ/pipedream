import zest from "../../zest.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zest-new-gift-response-received-instant",
  name: "New Gift Response Received (Instant)",
  description: "Emit new event when a recipient sends a thank you note. [See the documentation](https://gifts.zest.co/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    zest,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    thankYouNoteId: {
      propDefinition: [
        zest,
        "thankYouNoteId",
      ],
    },
    noteText: {
      propDefinition: [
        zest,
        "noteText",
      ],
    },
  },
  hooks: {
    async deploy() {
      // No historical data to emit for this source
    },
    async activate() {
      // Webhook subscription creation logic should be here if needed.
      // For this example, assume the webhook is created outside of this component.
    },
    async deactivate() {
      // Webhook deletion logic should be here if needed.
      // For this example, assume the webhook is managed outside of this component.
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Signature validation logic should be here if provided by the API
    // For this example, assume no signature validation is needed

    // Emit the event for the thank you note
    this.$emit(body, {
      id: body.thankYouNoteId,
      summary: `Thank you note received: ${body.noteText}`,
      ts: Date.now(),
    });

    // Respond to the webhook immediately if needed
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
