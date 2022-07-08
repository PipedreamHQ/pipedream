import quickbooks from "../../quickbooks.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks-create-invoice",
  name: "Create Invoice",
  description: "Creates an invoice. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#create-an-invoice)",
  version: "0.1.2",
  type: "action",
  props: {
    quickbooks,
    lineItems: {
      label: "Line Items",
      type: "any",
      description: "The minimum line item required for the request is one of the following: \n* `SalesItemLine` type\n* `GroupLine` type\nand Inline subtotal using `DescriptionOnlyLine`",
    },
    customerRefValue: {
      label: "Customer Reference Value",
      type: "string",
      description: "Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use `Customer.Id` from that object for `CustomerRef.value`.",
    },
    customerRefName: {
      label: "Customer Reference Name",
      type: "string",
      description: "Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use `Customer.DisplayName ` from that object for `CustomerRef.name`.",
      optional: true,
    },
    currencyRefValue: {
      label: "Currency Reference Value",
      type: "string",
      description: "A three letter string representing the ISO 4217 code for the currency. For example, `USD`, `AUD`, `EUR`, and so on. This must be defined if multicurrency is enabled for the company.\nMulticurrency is enabled for the company if `Preferences.MultiCurrencyEnabled` is set to `true`. Read more about multicurrency support [here](https://developer.intuit.com/docs?RedirectID=MultCurrencies). Required if multicurrency is enabled for the company.",
      optional: true,
    },
    currencyRefName: {
      label: "Currency Reference Name",
      type: "object",
      description: "The full name of the currency.",
      optional: true,
    },
    minorversion: {
      label: "Minor Version",
      type: "string",
      description: "Use the minorversion query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.lineItems || !this.customerRefValue) {
      throw new Error("Must provide lineItems, and customerRefValue parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://quickbooks.api.intuit.com/v3/company/${this.quickbooks.$auth.company_id}/invoice`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks.$auth.oauth_access_token}`,
        "accept": "application/json",
        "content-type": "application/json",
      },
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
        minorversion: this.minorversion,
      },
    });
  },
};
