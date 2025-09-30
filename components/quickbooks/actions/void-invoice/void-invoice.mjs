import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-void-invoice",
  name: "Void Invoice",
  description: "Voids an invoice. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#void-an-invoice)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quickbooks,
    invoiceId: {
      propDefinition: [
        quickbooks,
        "invoiceId",
      ],
    },
  },
  async run({ $ }) {
    // Get the current invoice to obtain SyncToken
    const invoiceResponse = await this.quickbooks.getInvoice({
      $,
      invoiceId: this.invoiceId,
    });

    if (!invoiceResponse?.Invoice) {
      throw new ConfigurationError(`Invoice with ID ${this.invoiceId} not found or could not be retrieved.`);
    }

    const invoice = invoiceResponse.Invoice;
    if (!invoice.SyncToken) {
      throw new ConfigurationError(`Invoice ${this.invoiceId} is missing required SyncToken.`);
    }

    const data = {
      Id: this.invoiceId,
      SyncToken: invoice.SyncToken,
    };

    const response = await this.quickbooks.voidInvoice({
      $,
      data,
    });

    if (response) {
      if (response.Invoice?.Id) {
        $.export("summary", `Successfully voided invoice with ID ${response.Invoice.Id}`);
      } else {
        $.export("summary", `Invoice void operation completed for ID ${this.invoiceId}`);
      }
    }

    return response;
  },
};
