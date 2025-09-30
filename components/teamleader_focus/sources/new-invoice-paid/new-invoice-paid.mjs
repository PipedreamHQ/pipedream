import common from "../common/common.mjs";

export default {
  ...common,
  key: "teamleader_focus-new-invoice-paid",
  name: "New Invoice Paid (Instant)",
  description: "Emit new event for each invoice paid. [See the documentation](https://developer.focus.teamleader.eu/docs/api/webhooks-register)",
  version: "0.0.3",
  type: "source",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      const { data } = await this.teamleaderFocus.listInvoices({
        data: {
          sort: [
            {
              field: "invoice_date",
              order: "desc",
            },
          ],
        },
      });
      return data?.filter(({ paid }) => paid) || [];
    },
    getEventTypes() {
      return [
        "invoice.paymentRegistered",
      ];
    },
    async getResource(body) {
      const invoiceId = body.subject.id;
      const { data } = await this.teamleaderFocus.getInvoice({
        data: {
          id: invoiceId,
        },
      });
      return data;
    },
    generateMeta(invoice) {
      return {
        id: invoice.id,
        summary: `Invoice ID ${invoice.id}`,
        ts: Date.parse(invoice.paid_at),
      };
    },
  },
};
