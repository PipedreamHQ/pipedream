import { parseOne } from "../../common/utils.mjs";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-create-purchase",
  name: "Create Purchase",
  description: "Creates a new purchase. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase#create-a-purchase)",
  version: "0.0.3",
  type: "action",
  props: {
    quickbooks,
    accountRefValue: {
      label: "Account Reference Value",
      type: "string",
      description: "Specifies the id of the account reference. Check must specify bank account, CreditCard must specify credit card account. Validation Rules:Valid and Active Account Reference of an appropriate type.",
    },
    paymentType: {
      label: "Payment Type",
      type: "string",
      description: "Payment Type can be: `Cash`, `Check`, or `CreditCard`.",
      options: [
        "Cash",
        "Check",
        "CreditCard",
      ],
    },
    lineItems: {
      propDefinition: [
        quickbooks,
        "lineItems",
      ],
    },
    accountRefName: {
      label: "Account Reference Name",
      type: "string",
      description: "Specifies the name of the account reference. Check must specify bank account, CreditCard must specify credit card account. Validation Rules:Valid and Active Account Reference of an appropriate type.",
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

    let parsedLineItems = parseOne(this.lineItems);

    const response = await this.quickbooks.createPurchase({
      $,
      data: {
        PaymentType: this.paymentType,
        AccountRef: {
          value: this.accountRefValue,
          name: this.accountRefName,
        },
        Line: parsedLineItems.length
          ? parsedLineItems.map((item) => parseOne(item))
          : [],
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
      $.export("summary", `Successfully created purchase with id ${response.Purchase.Id}`);
    }

    return response;
  },
};
