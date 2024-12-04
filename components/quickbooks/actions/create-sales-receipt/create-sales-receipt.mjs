import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-create-sales-receipt",
  name: "Create Sales Receipt",
  description: "Creates a sales receipt. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesreceipt#create-a-salesreceipt)",
  version: "0.0.6",
  type: "action",
  props: {
    quickbooks,
    currencyRefValue: {
      propDefinition: [
        quickbooks,
        "currencyRefValue",
      ],
      optional: true,
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
        description: "Line items of a sales receipt. Example: `{ \"DetailType\": \"SalesItemLineDetail\", \"Amount\": 100.0, \"SalesItemLineDetail\": { \"ItemRef\": { \"name\": \"Services\", \"value\": \"1\" } } }`",
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
    if (this.lineItemsAsObjects) {
      try {
        this.lineItems = this.lineItems.map((lineItem) => typeof lineItem === "string"
          ? JSON.parse(lineItem)
          : lineItem);
      } catch (error) {
        throw new ConfigurationError(`We got an error trying to parse the LineItems. Error: ${error}`);
      }
    }

    const response = await this.quickbooks.createSalesReceipt({
      $,
      data: {
        Line: this.lineItemsAsObjects
          ? this.lineItems
          : this.buildLineItems(),
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
