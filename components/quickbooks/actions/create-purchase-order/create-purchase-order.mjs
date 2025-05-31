import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";
import { 
  parseLineItems,
  buildPurchaseLineItems,
} from "../../common/utils.mjs";

export default {
  key: "quickbooks-create-purchase-order",
  name: "Create Purchase Order",
  description: "Creates a purchase order. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchaseorder#create-a-purchaseorder)",
  version: "0.0.1",
  type: "action",
  props: {
    quickbooks,
    vendorRefValue: {
      propDefinition: [
        quickbooks,
        "vendor",
      ],
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Date when the purchase order is due (YYYY-MM-DD)",
      optional: true,
    },
    currencyRefValue: {
      propDefinition: [
        quickbooks,
        "currency",
      ],
    },
    docNumber: {
      type: "string",
      label: "Document Number",
      description: "Reference number for the transaction",
      optional: true,
    },
    shipAddr: {
      type: "object",
      label: "Shipping Address",
      description: "Shipping address details",
      optional: true,
    },
    memo: {
      type: "string",
      label: "Memo",
      description: "Memo or note for the purchase order",
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
        description: "Line items of a purchase order. Set DetailType to `ItemBasedExpenseLineDetail` or `AccountBasedExpenseLineDetail`. Example: `{ \"DetailType\": \"ItemBasedExpenseLineDetail\", \"Amount\": 100.0, \"ItemBasedExpenseLineDetail\": { \"ItemRef\": { \"name\": \"Services\", \"value\": \"1\" } } }`",
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
      props[`detailType_${i}`] = {
        type: "string",
        label: `Line ${i} - Detail Type`,
        options: [
          { label: "Item Based Expense", value: "ItemBasedExpenseLineDetail" },
          { label: "Account Based Expense", value: "AccountBasedExpenseLineDetail" }
        ],
        default: "ItemBasedExpenseLineDetail",
      };
      props[`item_${i}`] = {
        type: "string",
        label: `Line ${i} - Item/Account ID`,
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
      return buildPurchaseLineItems(this.numLineItems, this);
    },
  },
  async run({ $ }) {
    if (!this.vendorRefValue) {
      throw new ConfigurationError("Vendor is required to create a purchase order.");
    }

    if (!this.numLineItems && !this.lineItemsAsObjects) {
      throw new ConfigurationError("At least one line item is required. Either specify the number of line items or provide line items as objects.");
    }

    const lines = this.lineItemsAsObjects
      ? parseLineItems(this.lineItems)
      : this.buildLineItems();

    if (!lines || lines.length === 0) {
      throw new ConfigurationError("No valid line items were provided.");
    }

    lines.forEach((line) => {
      if (line.DetailType !== "ItemBasedExpenseLineDetail" && line.DetailType !== "AccountBasedExpenseLineDetail") {
        throw new ConfigurationError("Line Item DetailType must be `ItemBasedExpenseLineDetail` or `AccountBasedExpenseLineDetail`");
      }
    });

    const data = {
      Line: lines,
      VendorRef: {
        value: this.vendorRefValue,
      },
      DueDate: this.dueDate,
      DocNumber: this.docNumber,
      ShipAddr: this.shipAddr,
      Memo: this.memo,
    };

    if (this.currencyRefValue) {
      data.CurrencyRef = {
        value: this.currencyRefValue,
      };
    }

    const response = await this.quickbooks.createPurchaseOrder({
      $,
      data,
    });

    if (response) {
      $.export("summary", `Successfully created purchase order with ID ${response.PurchaseOrder.Id}`);
    }

    return response;
  },
}; 