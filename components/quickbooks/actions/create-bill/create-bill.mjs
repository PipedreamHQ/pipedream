import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-create-bill",
  name: "Create Bill",
  description: "Creates a bill. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/bill#create-a-bill)",
  version: "0.1.2",
  type: "action",
  props: {
    quickbooks,
    vendorRefValue: {
      label: "Vendor Ref Value",
      type: "string",
      description: "Reference to the vendor for this transaction. Query the Vendor name list resource to determine the appropriate Vendor object for this reference. Use `Vendor.Id` from that object for `VendorRef.value`.",
    },
    lineItems: {
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
      label: "Minor Version",
      type: "string",
      description: "Use the minorversion query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.vendorRefValue || !this.lineItems) {
      throw new ConfigurationError("Must provide vendorRefValue, and lineItems parameters.");
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
