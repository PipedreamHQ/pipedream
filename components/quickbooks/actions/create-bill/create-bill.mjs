import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";
import { parseLineItems } from "../../common/utils.mjs";

export default {
  key: "quickbooks-create-bill",
  name: "Create Bill",
  description: "Creates a bill. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/bill#create-a-bill)",
  version: "0.1.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quickbooks,
    vendorRefValue: {
      propDefinition: [
        quickbooks,
        "vendorIds",
      ],
      type: "string",
      label: "Vendor ID",
      description: "Reference to the vendor for this transaction",
      optional: false,
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
        description: "Line items of a bill. Set DetailType to `AccountBasedExpenseLineDetail`. Example: `{ \"DetailType\": \"AccountBasedExpenseLineDetail\", \"Amount\": 100.0, \"AccountBasedExpenseLineDetail\": { \"AccountRef\": { \"name\": \"Advertising\", \"value\": \"1\" } } }` [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/bill#create-a-bill) for more information.",
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
          return  this.quickbooks.getPropOptions({
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
    if (!this.vendorRefValue || (!this.numLineItems && !this.lineItemsAsObjects)) {
      throw new ConfigurationError("Must provide vendorRefValue, and lineItems parameters.");
    }

    const lines = this.lineItemsAsObjects
      ? parseLineItems(this.lineItems)
      : this.buildLineItems();

    lines.forEach((line) => {
      if (line.DetailType !== "AccountBasedExpenseLineDetail") {
        throw new ConfigurationError("Line Item DetailType must be `AccountBasedExpenseLineDetail`");
      }
    });

    const response = await this.quickbooks.createBill({
      $,
      data: {
        VendorRef: {
          value: this.vendorRefValue,
        },
        Line: lines,
        CurrencyRef: {
          value: this.currencyRefValue,
        },
      },
    });

    if (response) {
      $.export("summary", `Successfully created bill with ID ${response.Bill.Id}`);
    }

    return response;
  },
};
