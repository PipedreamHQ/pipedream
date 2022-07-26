import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-sparse-update-invoice",
  name: "Sparse Update Invoice",
  description: "Sparse updating provides the ability to update a subset of properties for a given object; only elements specified in the request are updated. Missing elements are left untouched. The ID of the object to update is specified in the request body.​ [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#sparse-update-an-invoice)",
  version: "0.0.1",
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
    customerRefValue: {
      label: "Customer Reference Value",
      type: "string",
      description: "Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use `Customer.Id` from that object for `CustomerRef.value`.",
    },
    customerRefName: {
      propDefinition: [
        quickbooks,
        "customerRefName",
      ],
    },
    currencyRefValue: {
      propDefinition: [
        quickbooks,
        "currencyRefValue",
      ],
    },
    currencyRefName: {
      propDefinition: [
        quickbooks,
        "currencyRefName",
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
    if (!this.lineItems || !this.customerRefValue) {
      throw new ConfigurationError("Must provide lineItems, and customerRefValue parameters.");
    }

    try {
      this.lineItems = this.lineItems.map((lineItem) => typeof lineItem === "string"
        ? JSON.parse(lineItem)
        : lineItem);
    } catch (error) {
      throw new ConfigurationError(`We got an error trying to parse the LineItems. Error: ${error}`);
    }

    const { Invoice } = await this.quickbooks.getInvoice({
      $,
      invoiceId: this.invoiceId,
    });

    if (this.lineItems.length) Invoice.Line?.push(...this.lineItems);

    if (this.customerRefValue)
      Invoice.CustomerRef.value = this.customerRefValue;
    if (this.customerRefName)
      Invoice.CustomerRef.name = this.customerRefName;

    if (this.currencyRefValue)
      Invoice.CurrencyRef.value = this.currencyRefValue;
    if (this.currencyRefName)
      Invoice.CurrencyRef.name = this.currencyRefName;

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
