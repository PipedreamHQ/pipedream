import samsara from "../../samsara.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "samsara-new-document-submitted-instant",
  name: "New Document Submitted (Instant)",
  description: "Emit new event when a document is submitted.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    samsara: {
      type: "app",
      app: "samsara",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      // Since the setup of webhooks is manual for Samsara, no activation logic is needed here.
      // Ensure the webhook URL is configured in the Samsara dashboard to point to this source's endpoint.
    },
    async deactivate() {
      // Deactivation logic is manual for Samsara, so no deactivation code is needed.
      // Ensure the webhook is deleted from the Samsara dashboard when this source is deactivated.
    },
  },
  async run(event) {
    if (!event.body) {
      throw new Error("No body found in the webhook event.");
    }

    const body = event.body;
    const eventId = body.eventId || this.db.get("lastEventId");
    const eventTs = body.eventMs || Date.now();

    this.$emit(body, {
      id: eventId,
      summary: "New document submitted",
      ts: eventTs,
    });

    this.db.set("lastEventId", eventId);
  },
};
