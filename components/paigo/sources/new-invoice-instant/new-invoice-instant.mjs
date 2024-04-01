import paigo from "../../paigo.app.mjs";

export default {
  key: "paigo-new-invoice-instant",
  name: "New Invoice Instant",
  description: "Emit new event whenever a new invoice is generated.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    paigo: {
      type: "app",
      app: "paigo",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    invoiceDetails: {
      propDefinition: [
        paigo,
        "invoiceDetails",
      ],
    },
  },
  methods: {
    async getInvoice(invoiceId) {
      return await this.paigo.getInvoiceDetails(invoiceId);
    },
  },
  hooks: {
    async activate() {
      const webhookId = await this.paigo.createWebhook({
        targetUrl: this.http.endpoint,
        events: [
          "invoice.created",
        ],
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.paigo.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Check if the incoming POST request is a Paigo new invoice event
    if (body && headers["x-paigo-signature"]) {
      const invoiceId = body.data.id;

      // Fetch the invoice data
      const invoice = await this.getInvoice(invoiceId);

      this.$emit(invoice, {
        id: invoice.id,
        summary: `New invoice: ${invoice.id}`,
        ts: Date.parse(invoice.createdAt),
      });
    } else {
      console.log("No data to emit");
    }
  },
};
