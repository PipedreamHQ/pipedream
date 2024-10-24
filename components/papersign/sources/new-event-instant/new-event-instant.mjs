import papersign from "../../papersign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "papersign-new-event-instant",
  name: "New Event in Papersign",
  description: "Emit new event when any document or signer action occurs. [See the documentation](https://paperform.readme.io/reference/postpapersignfolderwebhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    papersign,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookName = "Pipedream Webhook";
      const triggers = [
        "document.sent",
        "document.completed",
        "document.cancelled",
        "document.rejected",
        "document.expired",
        "signer.notified",
        "signer.viewed",
        "signer.consent_accepted",
        "signer.nominated",
        "signer.signed",
      ];

      const response = await this.papersign._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          name: webhookName,
          target_url: this.http.endpoint,
          scope: "folder.all_descendants",
          triggers,
        },
      });

      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.papersign._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
  async run(event) {
    const body = event.body;

    // Respond to the webhook
    this.http.respond({
      status: 200,
      body: "OK",
    });

    this.$emit(body, {
      id: body.id || body.document_id,
      summary: `New event: ${body.name || body.document_name}`,
      ts: Date.parse(body.timestamp) || Date.now(),
    });
  },
};
