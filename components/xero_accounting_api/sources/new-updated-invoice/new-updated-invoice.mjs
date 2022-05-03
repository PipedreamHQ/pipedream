import { formatJsonDate } from "../../common/util.mjs";
import xero_accounting_api from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-new-updated-invoice",
  name: "New or updated invoice",
  description:
    "Emit notifications when you create a new or update existing invoice",
  version: "0.0.1",
  type: "source",
  props: {
    xero_accounting_api,
    tenant_id: {
      propDefinition: [xero_accounting_api, "tenant_id"],
    },
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll Xero accounting API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    db: "$.service.db",
  },
  dedupe: "unique",
  async run() {
    let lastDateChecked;

    this.db.get("lastDateChecked") &&
      (lastDateChecked = this.db.get("lastDateChecked"));

    if (!this.db.get("lastDateChecked")) {
      lastDateChecked = new Date().toISOString();
      this.db.set("lastDateChecked", lastDateChecked);
    }
    const invoices = (
      await this.xero_accounting_api.getInvoice(
        this.tenant_id,
        null,
        lastDateChecked
      )
    )?.Invoices;
    invoices &&
      invoices.reverse().forEach((invoice) => {
        const formatedDate = formatJsonDate(invoice.UpdatedDateUTC);
        this.db.set("lastDateChecked", formatedDate);
        this.$emit(invoice, {
          id: `${invoice.InvoiceID}D${formatedDate || ""}`,
        });
      });
  },
};
