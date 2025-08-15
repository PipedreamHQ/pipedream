import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { formatJsonDate } from "../../common/util.mjs";
import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-new-updated-invoice",
  name: "New or updated invoice",
  description: "Emit new notifications when you create a new or update existing invoice",
  version: "0.0.4",
  type: "source",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll Xero accounting API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
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
        modifiedSince: lastDateChecked,
      })
    )?.Invoices;
    invoices &&
      invoices.reverse().forEach((invoice) => {
        const formattedDate = formatJsonDate(invoice.UpdatedDateUTC);
        this.xeroAccountingApi.setLastDateChecked(this.db, formattedDate);
        this.$emit(invoice, {
          id: `${invoice.InvoiceID}D${formattedDate || ""}`,
          summary: invoice.InvoiceID,
        });
      });
  },
};
