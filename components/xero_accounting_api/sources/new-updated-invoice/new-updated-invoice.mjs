import { formatJsonDate } from "../../common/util.mjs";
import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "xero_accounting_api-new-updated-invoice",
  name: "New or updated invoice",
  description: "Emit new notifications when you create a new or update existing invoice",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  async run() {
    let lastDateChecked = this.xeroAccountingApi.getLastDateChecked(this.db);

    if (!lastDateChecked) {
      lastDateChecked = new Date().toISOString();
      this.xeroAccountingApi.setLastDateChecked(this.db, lastDateChecked);
    }

    const invoices = (
      await this.xeroAccountingApi.getInvoice({
        tenantId: this.tenantId,
        modifiedSince: lastDateChecked.slice(0, 10),
        headers: {
          Accept: "application/json",
        },
      })
    )?.Invoices;
    invoices &&
      invoices.reverse().forEach((invoice) => {
        const formattedDate = formatJsonDate(invoice.UpdatedDateUTC);
        this.xeroAccountingApi.setLastDateChecked(this.db, formattedDate);
        this.$emit(invoice, {
          id: `${invoice.InvoiceID}D${formattedDate || ""}`,
          summary: invoice.InvoiceID,
          ts: Date.parse(invoice.DateString),
        });
      });
  },
};
