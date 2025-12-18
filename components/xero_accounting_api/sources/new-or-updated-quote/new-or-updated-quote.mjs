import common from "../common/base-polling.mjs";
import { formatJsonDate } from "../../common/util.mjs";

export default {
  ...common,
  key: "xero_accounting_api-new-or-updated-quote",
  name: "New or Updated Quote",
  description: "Emit new event each time a quote is added or updated. [See the documentation](https://developer.xero.com/documentation/api/accounting/quotes)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  async run() {
    let lastDateChecked = this.xeroAccountingApi.getLastDateChecked(this.db);

    if (!lastDateChecked) {
      lastDateChecked = new Date().toISOString();
      this.xeroAccountingApi.setLastDateChecked(this.db, lastDateChecked);
    }

    const { Quotes: quotes } = await this.xeroAccountingApi.listQuotes({
      tenantId: this.tenantId,
      modifiedSince: lastDateChecked.slice(0, 10),
      headers: {
        Accept: "application/json",
      },
    });

    quotes && quotes.reverse().forEach((quote) => {
      const formattedDate = formatJsonDate(quote.UpdatedDateUTC);
      this.xeroAccountingApi.setLastDateChecked(this.db, formattedDate);
      this.$emit(quote,
        {
          id: `${quote.QuoteID}D${formattedDate || ""}`,
          summary: `Quote Number: ${quote.QuoteNumber}`,
          ts: Date.parse(quote.DateString),
        });
    });
  },
};
