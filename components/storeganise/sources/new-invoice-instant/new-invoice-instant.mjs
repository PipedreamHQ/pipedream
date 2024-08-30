import storeganise from "../../storeganise.app.mjs";

export default {
  key: "storeganise-new-invoice-instant",
  name: "New Invoice Instant",
  description: "Emits an event when a new invoice is created in Storeganise.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    storeganise,
    invoiceId: {
      propDefinition: [
        storeganise,
        "invoiceId",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const data = {
        url: this.http.endpoint,
        events: [
          "invoice_created",
        ],
      };
      const result = await this.storeganise.createWebhook(data);
      this.db.set("webhookId", result.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.storeganise.deleteWebhook(webhookId);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["x-storeganise-signature"] !== this.storeganise.$auth.api_token) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    if (body.event !== "invoice_created") {
      this.http.respond({
        status: 200,
      });
      return;
    }
    this.http.respond({
      status: 200,
    });
    this.$emit(body, {
      id: body.data.id,
      summary: `New invoice created: ${body.data.id}`,
      ts: Date.now(),
    });
  },
};
