import clearBooks from "../../clear_books.app.mjs";

export default {
  key: "clear_books-create-purchase-document",
  name: "Create Purchase Document",
  description: "Creates a new Purchase Document in Clear Books. [See the documentation](https://u.pcloud.link/publink/show?code=XZkThJ5Z4zKewgCL6VBpfxlPeHPDdXXj0Cc7)",
  version: "0.0.1",
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
      description: "The number of line items to create",
      reloadProps: true,
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
  async run({ $ }) {
    const lineItems = [];
    for (let i = 1; i <= this.numLineItems; i++) {
      lineItems.push({
        unitPrice: this[`line_items_${i}_unit_price`],
        quantity: this[`line_items_${i}_quantity`],
        description: this[`line_items_${i}_description`],
      });
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
