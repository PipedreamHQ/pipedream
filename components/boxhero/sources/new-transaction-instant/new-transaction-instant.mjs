import boxhero from "../../boxhero.app.mjs";

export default {
  key: "boxhero-new-transaction-instant",
  name: "New Transaction Instant",
  description: "Emit new event when a transaction occurs. [See the documentation](https://docs-en.boxhero-app.com/boxhero-api/boxhero-api-reference)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    boxhero: {
      type: "app",
      app: "boxhero",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    transactionId: {
      propDefinition: [
        boxhero,
        "transactionId",
      ],
    },
    transactionType: {
      propDefinition: [
        boxhero,
        "transactionType",
      ],
    },
    itemDetails: {
      propDefinition: [
        boxhero,
        "itemDetails",
      ],
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.boxhero.createTransaction();
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.boxhero.deleteTransaction(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["x-webhook-signature"] !== this.boxhero.$auth.oauth_access_token) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.$emit(body, {
      id: body.transactionId,
      summary: `New transaction: ${body.transactionType}`,
      ts: Date.now(),
    });
  },
};
