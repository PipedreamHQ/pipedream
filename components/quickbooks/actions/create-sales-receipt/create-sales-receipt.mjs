import quickbooks from "../../quickbooks.app.mjs";
import { parseLineItems } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "quickbooks-create-sales-receipt",
  name: "Create Sales Receipt",
  description: "Creates a sales receipt. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesreceipt#create-a-salesreceipt)",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quickbooks,
    lineItemsAsObjects: {
      propDefinition: [
        quickbooks,
        "lineItemsAsObjects",
      ],
      reloadProps: true,
    },
    currencyRefValue: {
      propDefinition: [
        quickbooks,
        "currency",
      ],
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.lineItemsAsObjects) {
      props.lineItems = {
        type: "string[]",
        label: "Line Items",
        description: "Line items of a sales receipt. Set DetailType to `SalesItemLineDetail` or `GroupLineDetail`. Example: `{ \"DetailType\": \"SalesItemLineDetail\", \"Amount\": 100.0, \"SalesItemLineDetail\": { \"ItemRef\": { \"name\": \"Services\", \"value\": \"1\" } } }` [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesreceipt#create-a-salesreceipt) for more information.",
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
      props[`item_${i}`] = {
        type: "string",
        label: `Line ${i} - Item ID`,
        options: async ({ page }) => {
          return this.quickbooks.getPropOptions({
            page,
            resource: "Item",
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
          DetailType: "SalesItemLineDetail",
          Amount: this[`amount_${i}`],
          SalesItemLineDetail: {
            ItemRef: {
              value: this[`item_${i}`],
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
      if (line.DetailType !== "SalesItemLineDetail" && line.DetailType !== "GroupLineDetail") {
        throw new ConfigurationError("Line Item DetailType must be `SalesItemLineDetail` or `GroupLineDetail`");
      }
    });

    const response = await this.quickbooks.createSalesReceipt({
      $,
      data: {
        Line: lines,
        CurrencyRef: this.currencyRefValue && {
          value: this.currencyRefValue,
        },
      },
    });

    if (response) {
      $.export("summary", `Successfully created sales receipt with ID ${response.SalesReceipt.Id}`);
    }

    return response;
  },
};
