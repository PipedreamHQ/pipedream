import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-invoice",
  name: "Get Invoice",
  description: "Returns info about an invoice. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#read-an-invoice)",
  version: "0.2.5",
  type: "action",
  props: {
    quickbooks,
    invoiceId: {
      label: "Invoice ID",
      type: "string",
      description: "Id of the invoice to get details of.",
      optional: true,
    },
    minorVersion: {
      propDefinition: [
        quickbooks,
        "minorVersion",
      ],
    },
  },
  async run({ $ }) {
    if (!this.invoiceId) {
      throw new ConfigurationError("Must provide invoiceId parameter.");
    }

    const response = await this.quickbooks.getInvoice({
      $,
      invoiceId: this.invoiceId,
      params: {
        minorversion: this.minorVersion,
      },
    });

    if (response) {
      $.export("summary", `Successfully retrieved invoice with id ${response.Invoice.Id}`);
    }

    return response;
  },
};
