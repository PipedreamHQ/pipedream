import commonSources from "../../common/sources.mjs";

export default {
  ...commonSources,
  type: "source",
  key: "wave-new-invoice",
  name: "New Invoice",
  version: "0.0.1",
  description: "Emit new event when an invoice is created.",
  methods: {
    ...commonSources.methods,
    emitEvent(invoice) {
      this.$emit(invoice, {
        id: invoice.id,
        summary: `Invoice Number #${invoice.invoiceNumber}`,
        ts: invoice.createdAt,
      });
    },
  },
  async run() {
    let page = 1;
    const eventsToEmit = [];
    const lastEventId = this.getLastEventId();

    loop1:
    while (true) {
      const res = await this.app.listInvoicesByBusiness(
        this.businessId,
        page,
      );

      for (const invoice of res.data.business.invoices.edges) {
        // If we've already seen this invoice (based on event ID), break out of the loop.
        if (lastEventId && invoice.node.id === lastEventId) {
          break loop1;
        }
        eventsToEmit.unshift(invoice);
      }

      const {
        currentPage,
        totalPages,
      } = res.data.business.invoices.pageInfo;
      if (currentPage === totalPages) {
        break;
      }

      page++;
    }
    for (const invoice of eventsToEmit) {
      this.emitEvent(invoice.node);
    }

    if (eventsToEmit.length > 0) {
      this.setLastEventId(eventsToEmit[eventsToEmit.length - 1].node.id);
    }
  },
};
