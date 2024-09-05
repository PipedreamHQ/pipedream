import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-create-bill",
  name: "Create Bill",
  description: "Creates a bill. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/bill#create-a-bill)",
  version: "0.1.5",
  type: "action",
  props: {
    quickbooks,
    vendorRefValue: {
      label: "Vendor Ref Value",
      type: "string",
      description: "Reference to the vendor for this transaction. Query the Vendor name list resource to determine the appropriate Vendor object for this reference. Use `Vendor.Id` from that object for `VendorRef.value`.",
    },
    lineItems: {
      description: "Individual line items of a transaction. Valid Line types include: `ItemBasedExpenseLine` and `AccountBasedExpenseLine`. One minimum line item required for the request to succeed. E.g `[ { \"DetailType\": \"AccountBasedExpenseLineDetail\", \"Amount\": 200.0, \"AccountBasedExpenseLineDetail\": { \"AccountRef\": { \"value\": \"1\" } } } ]`",
      propDefinition: [
        quickbooks,
        "lineItems",
      ],
    },
    vendorRefName: {
      label: "Vendor Reference Name",
      type: "string",
      description: "Reference to the vendor for this transaction. Query the Vendor name list resource to determine the appropriate Vendor object for this reference. Use `Vendor.Name` from that object for `VendorRef.name`.",
      optional: true,
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
    if (!this.vendorRefValue || !this.lineItems) {
      throw new ConfigurationError("Must provide vendorRefValue, and lineItems parameters.");
    }

    try {
      this.lineItems = this.lineItems.map((lineItem) => typeof lineItem === "string"
        ? JSON.parse(lineItem)
        : lineItem);
    } catch (error) {
      throw new ConfigurationError(`We got an error trying to parse the LineItems. Error: ${error}`);
    }

    const response = await this.quickbooks.createBill({
      $,
      data: {
        VendorRef: {
          value: this.vendorRefValue,
          name: this.vendorRefName,
        },
        Line: this.lineItems,
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
      $.export("summary", `Successfully created bill with id ${response.Bill.Id}`);
    }

    return response;
  },
};
