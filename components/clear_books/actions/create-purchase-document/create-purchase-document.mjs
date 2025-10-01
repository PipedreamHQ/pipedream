import clearBooks from "../../clear_books.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "clear_books-create-purchase-document",
  name: "Create Purchase Document",
  description: "Creates a new Purchase Document in Clear Books. [See the documentation](https://u.pcloud.link/publink/show?code=XZkThJ5Z4zKewgCL6VBpfxlPeHPDdXXj0Cc7)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    clearBooks,
    purchaseType: {
      propDefinition: [
        clearBooks,
        "purchaseType",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the purchase. Format: YYYY-MM-DD",
    },
    supplierId: {
      propDefinition: [
        clearBooks,
        "supplierId",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the purchase document",
      optional: true,
    },
    numLineItems: {
      type: "integer",
      label: "Number of Line Items",
      description: "The number of line items. Use this to manually enter Unit Price, Quantity, and Description of each line item.",
      optional: true,
      reloadProps: true,
    },
    lineItemsJson: {
      type: "string",
      label: "Line Items JSON",
      description: "JSON value containing an array of Line Items. For example: `[{\"description\":\"Line Item 1 Description\",\"unitPrice\":1022,\"quantity\":1,\"accountCode\":\"2001001\"},{\"description\":\"Line Item 2 Description\",\"unitPrice\":1023,\"quantity\":2,\"accountCode\":\"2001001\"}]`. [See documentation](https://u.pcloud.link/publink/show?code=XZkThJ5Z4zKewgCL6VBpfxlPeHPDdXXj0Cc7)",
      optional: true,
    },
  },
  additionalProps() {
    const props = {};
    if (!this.numLineItems) {
      return props;
    }
    for (let i = 1; i <= this.numLineItems; i++) {
      props[`line_item_${i}_unit_price`] = {
        type: "string",
        label: `Line Item ${i} - Unit Price`,
      };
      props[`line_item_${i}_quantity`] = {
        type: "integer",
        label: `Line Item ${i} - Quantity`,
      };
      props[`line_item_${i}_description`] = {
        type: "string",
        label: `Line Item ${i} - Description`,
      };
    }
    return props;
  },
  methods: {
    buildLineItems() {
      const lineItems = [];
      for (let i = 1; i <= this.numLineItems; i++) {
        lineItems.push({
          unitPrice: this[`line_item_${i}_unit_price`],
          quantity: this[`line_item_${i}_quantity`],
          description: this[`line_item_${i}_description`],
        });
      }
      return lineItems;
    },
    parseLineItemsJson() {
      try {
        return Array.isArray(this.lineItemsJson)
          ? this.lineItemsJson.map((item) => typeof item === "string"
            ? JSON.parse(item)
            : item)
          : typeof this.lineItemsJson === "string"
            ? JSON.parse(this.lineItemsJson)
            : this.lineItemsJson;
      } catch {
        throw new ConfigurationError("Could not parse Line Items JSON");
      }
    },
  },
  async run({ $ }) {
    if (!this.numLineItems && !this.lineItemsJson) {
      throw new ConfigurationError("Please enter at least one line item");
    }

    const lineItems = [];
    if (this.numLineItems) {
      const lineItemsManual = this.buildLineItems();
      lineItems.push(...lineItemsManual);
    }
    if (this.lineItemsJson) {
      const lineItemsJson = this.parseLineItemsJson();
      lineItems.push(...lineItemsJson);
    }

    const response = await this.clearBooks.createPurchaseDocument({
      $,
      type: this.purchaseType,
      data: {
        date: this.date,
        supplierId: this.supplierId,
        description: this.description,
        lineItems,
      },
    });
    $.export("$summary", `Successfully created purchase document with ID ${response.id}`);
    return response;
  },
};
