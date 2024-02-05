import altoviz from "../../altoviz.app.mjs";

export default {
  key: "altoviz-new-sales-invoice-instant",
  name: "New Sales Invoice Instant",
  description: "Emits an event each time a sales invoice is created, updated, or deleted in Altoviz",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    altoviz,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    invoice: {
      propDefinition: [
        altoviz,
        "invoice",
      ],
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created, updated, deleted,
      } = data;
      const ts = new Date(deleted || updated || created).getTime();
      return {
        id,
        summary: `Invoice ${deleted
          ? "deleted"
          : updated
            ? "updated"
            : "created"}`,
        ts,
      };
    },
    async getInvoices(page = 1) {
      return await this.altoviz._makeRequest({
        path: `/Invoices?page=${page}`,
      });
    },
  },
  async run() {
    const since = this.db.get("since") || 0;
    let done = false;
    let page = 1;
    while (!done) {
      const { data: invoices } = await this.getInvoices(page++);
      for (const invoice of invoices) {
        const updated = new Date(invoice.updated).getTime();
        const created = new Date(invoice.created).getTime();
        const deleted = invoice.deleted
          ? new Date(invoice.deleted).getTime()
          : null;
        const lastEvent = Math.max(updated, created, deleted || 0);
        if (lastEvent > since) {
          this.$emit(invoice, this.generateMeta(invoice));
        } else {
          done = true;
          break;
        }
      }
      if (invoices.length < 100) {
        done = true;
      }
    }
    this.db.set("since", Date.now());
  },
};
