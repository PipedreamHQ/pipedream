import quickbooks from "../../quickbooks.app.mjs";
import { parseLineItems } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "quickbooks-create-purchase",
  name: "Create Purchase",
  description: "Creates a new purchase. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase#create-a-purchase)",
  version: "0.0.11",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "Specifies the ID of the account reference. Check must specify bank account, CreditCard must specify credit card account. Validation Rules:Valid and Active Account Reference of an appropriate type.",
      optional: false,
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
    currencyRefValue: {
      propDefinition: [
        quickbooks,
        "currency",
      ],
    },
    lineItemsAsObjects: {
      propDefinition: [
        quickbooks,
        "lineItemsAsObjects",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.lineItemsAsObjects) {
      props.lineItems = {
        type: "string[]",
        label: "Line Items",
        description: "Line items of a purchase. Set DetailType to `AccountBasedExpenseLineDetail`. Example: `{ \"DetailType\": \"AccountBasedExpenseLineDetail\", \"Amount\": 100.0, \"AccountBasedExpenseLineDetail\": { \"AccountRef\": { \"name\": \"Advertising\", \"value\": \"1\" } } }` [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase#create-a-purchase) for more information.",
      };
      return props;
    }
    props.numLineItems = {
      type: "integer",
      label: "Number of Line Items",
      description: "The number of line items to enter",
      reloadProps: true,
    };
    if (!this.numLineItems) {
      return props;
    }
    for (let i = 1; i <= this.numLineItems; i++) {
      props[`account_${i}`] = {
        type: "string",
        label: `Line ${i} - Account ID`,
        options: async ({ page }) => {
          return this.quickbooks.getPropOptions({
            page,
            resource: "Account",
            mapper: ({
              Id: value, Name: label,
            }) => ({
              value,
              label,
            }),
          });
        },
      };
      props[`amount_${i}`] = {
        type: "string",
        label: `Line ${i} - Amount`,
      };
    }
    return props;
  },
  methods: {
    buildLineItems() {
      const lineItems = [];
      for (let i = 1; i <= this.numLineItems; i++) {
        lineItems.push({
          DetailType: "AccountBasedExpenseLineDetail",
          Amount: this[`amount_${i}`],
          AccountBasedExpenseLineDetail: {
            AccountRef: {
              value: this[`account_${i}`],
            },
          },
        });
      }
      return lineItems;
    },
  },
  async run({ $ }) {
    const lines = this.lineItemsAsObjects
      ? parseLineItems(this.lineItems)
      : this.buildLineItems();

    lines.forEach((line) => {
      if (line.DetailType !== "AccountBasedExpenseLineDetail") {
        throw new ConfigurationError("Line Item DetailType must be `AccountBasedExpenseLineDetail`");
      }
    });
    const response = await this.quickbooks.createPurchase({
      $,
      data: {
        PaymentType: this.paymentType,
        AccountRef: {
          value: this.accountRefValue,
        },
        Line: lines,
        CurrencyRef: {
          value: this.currencyRefValue,
        },
      },
    });

    if (response) {
      $.export("summary", `Successfully created purchase with ID ${response.Purchase.Id}`);
    }

    return response;
  },
};
