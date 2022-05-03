import { formatJsonDate } from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-new-updated-invoice",
  name: "New or updated invoice",
  description:
    "Emit new notifications when you create a new or update existing invoice",
  version: "0.0.1",
  type: "source",
  props: {
    xeroAccountingApi,
    tenant_id: {
      propDefinition: [
        xeroAccountingApi,
        "tenant_id",
      ],
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
    let lastDateChecked = this.xeroAccountingApi.getLastDateChecked();

    if (!lastDateChecked) {
      lastDateChecked = new Date().toISOString();
      this.xeroAccountingApi.setLastDateChecked(lastDateChecked);
    }

    const invoices = (
      await this.xeroAccountingApi.getInvoice(
        this.tenant_id,
        null,
        lastDateChecked,
      )
    )?.Invoices;
    invoices &&
      invoices.reverse().forEach((invoice) => {
        const formatedDate = formatJsonDate(invoice.UpdatedDateUTC);
        this.xeroAccountingApi.setLastDateChecked(formatedDate);
        this.$emit(invoice, {
          id: `${invoice.InvoiceID}D${formatedDate || ""}`,
        });
      });
  },
};
