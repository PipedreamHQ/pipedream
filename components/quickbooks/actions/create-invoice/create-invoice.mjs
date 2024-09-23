import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-create-invoice",
  name: "Create Invoice",
  description: "Creates an invoice. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#create-an-invoice)",
  version: "0.1.5",
  type: "action",
  props: {
    quickbooks,
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

    const response = await this.quickbooks.createInvoice({
      $,
      data: {
        Line: this.lineItems,
        CustomerRef: {
          value: this.customerRefValue,
          name: this.customerRefName,
        },
        CurrencyRef: {
          value: this.currencyRefValue,
          name: this.currencyRefName,
        },
      },
      params: {
        minorversion: this.minorVersion,
      },
    });

    if (response) {
      $.export("summary", `Successfully created invoice with id ${response.Invoice.Id}`);
    }

    return response;
  },
};
