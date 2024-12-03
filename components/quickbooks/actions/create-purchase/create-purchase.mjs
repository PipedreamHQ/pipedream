import { parseOne } from "../../common/utils.mjs";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-create-purchase",
  name: "Create Purchase",
  description: "Creates a new purchase. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase#create-a-purchase)",
  version: "0.0.5",
  type: "action",
  props: {
    quickbooks,
    accountRefValue: {
      propDefinition: [
        quickbooks,
        "accountIds",
      ],
      type: "string",
      label: "Account Reference Value",
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
    });

    if (response) {
      $.export("summary", `Successfully created purchase with id ${response.Purchase.Id}`);
    }

    return response;
  },
};
