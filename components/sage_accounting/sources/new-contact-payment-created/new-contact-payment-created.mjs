import common from "../common/polling.mjs";

export default {
  ...common,
  key: "sage_accounting-new-contact-payment-created",
  name: "New Contact Payment Created",
  description: "Emit new event when a contact payment is created in Sage Accounting. [See the documentation](https://developer.sage.com/accounting/reference/payments/#tag/Contact-Payments/operation/getContactPayments)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(payment) {
      const id = this.getItemId(payment);
      const summary = this.getItemSummary(payment);
      return {
        id,
        summary: `New Payment to: ${summary}`,
        ts: payment.created_at
          ? new Date(payment.created_at).getTime()
          : Date.now(),
      };
    },
    getItemId(payment) {
      return payment.id;
    },
    getItemSummary(payment) {
      const contactName = payment.contact?.displayed_as || payment.contact?.name || "Unknown Contact";
      return contactName;
    },
    async getItems() {
      const payments = await this.sageAccounting.listContactPayments({
        params: {
          items_per_page: 100,
          sort: "created_at:desc",
        },
      });
      return payments || [];
    },
  },
};
