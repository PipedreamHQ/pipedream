import boloforms from "../../boloforms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "boloforms-new-signature-completed-instant",
  name: "New Signature Completed Instant",
  description: "Emit new event when a PDF document is fully signed. [See the documentation](https://help.boloforms.com/en/collections/8024362-webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    boloforms,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    documentId: {
      propDefinition: [
        boloforms,
        "documentId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Placeholder for fetching historical data if needed
    },
    async activate() {
      // Placeholder for webhook subscription if needed
    },
    async deactivate() {
      // Placeholder for webhook unsubscription if needed
    },
  },
  async run(event) {
    const { body } = event;
    if (!body || !body.data || body.data.documentId !== this.documentId) {
      this.http.respond({
        status: 404,
        body: "Document ID does not match or missing data",
      });
      return;
    }

    if (body.data.status === "completed") {
      this.$emit(body.data, {
        id: body.data.documentId,
        summary: `Document ${body.data.documentId} fully signed`,
        ts: Date.parse(body.data.timestamp) || Date.now(),
      });
    }

    this.http.respond({
      status: 200,
      body: "Event processed",
    });
  },
};
