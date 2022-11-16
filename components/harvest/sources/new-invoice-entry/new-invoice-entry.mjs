import harvest from "../../harvest.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "harvest-new-invoice-entry",
  name: "New Invoice Entry",
  description: "Emit new notifications when a new invoice is created",
  version: "0.0.3",
  type: "source",
  props: {
    harvest,
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll Harvest API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  dedupe: "unique",
  async run() {
    const data = [];
    let lastDateChecked = this.harvest.getLastDateChecked(this.db);
    if (!lastDateChecked) {
      lastDateChecked = new Date().toISOString();
      this.harvest.setLastDateChecked(this.db, lastDateChecked);
    }
    const invoices = await this.harvest.listInvoicesPaginated({
      page: 1,
      updatedSince: lastDateChecked,
    });
    for await (const invoice of invoices) {
      data.push(invoice);
    }
    data && data.reverse().forEach((invoice) => {
      this.harvest.setLastDateChecked(this.db, invoice.updated_at);
      this.$emit(invoice,
        {
          id: invoice.id,
          summary: `Invoice number: ${invoice.number}`,
          ts: Date.parse(invoice.updated_at),
        });
    });
  },
};
