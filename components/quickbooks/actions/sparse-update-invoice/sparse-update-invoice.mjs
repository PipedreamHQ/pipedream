import { ConfigurationError } from "@pipedream/platform";
import { parseOne } from "../../common/utils.mjs";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-sparse-update-invoice",
  name: "Sparse Update Invoice",
  description: "Sparse updating provides the ability to update a subset of properties for a given object; only elements specified in the request are updated. Missing elements are left untouched. The ID of the object to update is specified in the request body.​ [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#sparse-update-an-invoice)",
  version: "0.1.3",
  type: "action",
  props: {
    quickbooks,
    invoiceId: {
      propDefinition: [
        quickbooks,
        "invoiceId",
      ],
    },
    lineItems: {
      propDefinition: [
        quickbooks,
        "lineItems",
      ],
    },
    customer: {
      propDefinition: [
        quickbooks,
        "customer",
      ],
    },
    currency: {
      propDefinition: [
        quickbooks,
        "currency",
      ],
    },
    minorVersion: {
      propDefinition: [
        quickbooks,
        "minorVersion",
      ],
    },
  },
  async run({ $ }) {
    try {
      this.lineItems = this.lineItems.map((lineItem) => typeof lineItem === "string"
        ? JSON.parse(lineItem)
        : lineItem);
    } catch (error) {
      throw new ConfigurationError(`We got an error trying to parse the Line Items prop. Error: ${error}`);
    }

    const { Invoice } = await this.quickbooks.getInvoice({
      $,
      invoiceId: this.invoiceId,
    });

    if (this.lineItems.length) Invoice.Line?.push(...this.lineItems);

    Invoice.CurrencyRef = parseOne(this.currency);
    Invoice.CustomerRef = parseOne(this.customer);

    const response = await this.quickbooks.sparseUpdateInvoice({
      $,
      data: Invoice,
      params: {
        minorversion: this.minorVersion,
      },
    });

    if (response) {
      $.export("summary", `Successfully updated invoice with id ${response.Invoice.Id}`);
    }

    return response;
  },
};
