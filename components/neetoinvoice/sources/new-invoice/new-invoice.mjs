import neetoinvoice from "../../neetoinvoice.app.mjs";

export default {
  key: "neetoinvoice-new-invoice",
  name: "New Invoice",
  description: "Emit new event when there is a new invoice. [See the documentation](https://help.neetoinvoice.com/articles/neetoinvoice-zapier-integration)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    neetoinvoice,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    subscriptionUrl: {
      propDefinition: [
        neetoinvoice,
        "subscriptionUrl",
      ],
    },
    eventType: {
      propDefinition: [
        neetoinvoice,
        "eventType",
        (c) => ({
          event: c.eventType,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      const pageSize = 50;
      const pageIndex = 1;
      const invoices = await this.neetoinvoice.getInvoices({
        pageSize,
        pageIndex,
      });
      invoices.slice(-50).forEach((invoice) => {
        this.$emit(invoice, {
          id: invoice.id,
          summary: `New invoice: ${invoice.number}`,
          ts: Date.parse(invoice.created_at),
        });
      });
    },
    async activate() {
      const subscription = await this.neetoinvoice.subscribe({
        url: this.subscriptionUrl,
        event: this.eventType.value,
      });
      this.db.set("subscriptionId", subscription.id);
    },
    async deactivate() {
      const subscriptionId = this.db.get("subscriptionId");
      await this.neetoinvoice.unsubscribe(subscriptionId);
    },
  },
  async run(event) {
    const body = event.body;
    this.$emit(body, {
      id: body.id,
      summary: `New invoice: ${body.number}`,
      ts: Date.parse(body.created_at),
    });

    this.http.respond({
      status: 200,
      body: "",
    });
  },
};
