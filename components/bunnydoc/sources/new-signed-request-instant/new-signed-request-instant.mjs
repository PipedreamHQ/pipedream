import bunnydoc from "../../bunnydoc.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bunnydoc-new-signed-request-instant",
  name: "New Signed Request Instant",
  description: "Emits an event each time a signature request is signed. [See the documentation](https://support.bunnydoc.com/doc/api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    bunnydoc,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    hookUrl: {
      propDefinition: [
        bunnydoc,
        "hookUrl",
      ],
    },
    webhookEvents: {
      propDefinition: [
        bunnydoc,
        "webhookEvents",
      ],
    },
  },
  hooks: {
    async activate() {
      const webhookEvents = [
        "signatureRequestSigned",
      ];
      const response = await this.bunnydoc.subscribeWebhook({
        hookUrl: this.hookUrl,
        webhookEvents,
      });
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const id = this.db.get("webhookId");
      await this.bunnydoc.unsubscribeWebhook({
        id,
      });
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
      body: "BUNNYDOC API EVENT RECEIVED",
    });
    if (event.body && event.body.event === "signatureRequestSigned") {
      const eventData = event.body;
      this.$emit(eventData, {
        id: eventData.envelopeId,
        summary: `Signature request signed by ${eventData.recipients.map((r) => r.name).join(", ")}`,
        ts: Date.now(),
      });
    }
  },
};
