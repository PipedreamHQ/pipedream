import sellsy from "../../sellsy.app.mjs";

export default {
  key: "sellsy-new-company-instant",
  name: "New Company Instant",
  description: "Emits an event when a new company (client or prospect) is created in Sellsy.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    sellsy,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    companyName: {
      propDefinition: [
        sellsy,
        "companyName",
      ],
      optional: true,
    },
    companyType: {
      propDefinition: [
        sellsy,
        "companyType",
      ],
      optional: true,
    },
    companyContact: {
      propDefinition: [
        sellsy,
        "companyContact",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.sellsy.createWebhook({
        url: this.http.endpoint,
        events: [
          "new.company",
        ],
      });
      this.db.set("webhookId", id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.sellsy.deleteWebhook({
          id: webhookId,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // validate the incoming webhook
    if (headers["X-Sellsy-Signature"] !== this.sellsy.$auth.webhook_signature) {
      console.log("Received an unauthorized request");
      return;
    }

    const {
      companyName, companyType, companyContact,
    } = body;

    // emit the event
    this.$emit(body, {
      id: body.id,
      summary: `New company created: ${companyName}`,
      ts: Date.now(),
    });
  },
};
