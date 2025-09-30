import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-invoice",
  name: "Get Invoice",
  description: "Returns info about an invoice. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#read-an-invoice)",
  version: "0.2.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    if (!this.invoiceId) {
      throw new ConfigurationError("Must provide invoiceId parameter.");
    }

    const response = await this.quickbooks.getInvoice({
      $,
      invoiceId: this.invoiceId,
    });

    if (response) {
      $.export("summary", `Successfully retrieved invoice with ID ${response.Invoice.Id}`);
    }

    return response;
  },
};
