import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-create-invoice",
  name: "Create Invoice",
  description: "Creates an invoice. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#create-an-invoice)",
  version: "0.1.2",
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
      label: "Minor Version",
      type: "string",
      description: "Use the minorversion query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.lineItems || !this.customerRefValue) {
      throw new ConfigurationError("Must provide lineItems, and customerRefValue parameters.");
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
