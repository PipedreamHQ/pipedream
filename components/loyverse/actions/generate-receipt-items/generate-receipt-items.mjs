import loyverse from "../../loyverse.app.mjs";

export default {
  key: "loyverse-generate-receipt-items",
  name: "Generate Receipt Items",
  description: "Generates the data for items to use in a receipt. [See the documentation](https://developer.loyverse.com/docs/#tag/Receipts/paths/~1receipts/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    loyverse,
    lineItems: {
      type: "string[]",
      label: "Line Items",
      description: "[An array of JSON-stringified objects](https://developer.loyverse.com/docs/#tag/Receipts/paths/~1receipts/post). You can use the props below to generate each item and copy it into this array.",
    },
    storeId: {
      propDefinition: [
        loyverse,
        "storeId",
      ],
      reloadProps: true,
    },
    itemVariantId: {
      propDefinition: [
        loyverse,
        "itemVariantId",
      ],
      reloadProps: true,
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "The number of items being purchased",
      reloadProps: true,
    },
    price: {
      type: "integer",
      label: "Price",
      description: "The price of one item. By default it is equal to the price of the selected item variant.",
      optional: true,
      reloadProps: true,
    },
    cost: {
      type: "integer",
      label: "Cost",
      description: "The cost of one item at the moment of transaction. By default it is equal to the cost of the selected item variant.",
      optional: true,
      reloadProps: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "The line item note.",
      optional: true,
      reloadProps: true,
    },
  },
  additionalProps() {
    const {
      storeId, itemVariantId, quantity, price, cost, note,
    } = this;
    if ([
      storeId,
      itemVariantId,
      quantity,
    ].includes(undefined)) {
      return {};
    }
    const propStr = [
      `"variant_id": "${itemVariantId}"`,
      `"store_id": "${storeId}"`,
      `"quantity": ${quantity}`,
      `"price": ${price}`,
      `"cost": ${cost}`,
      `"line_note": "${note}"`,
    ].filter((str) => !str.includes("undefined")).join(", ");
    return {
      output: {
        type: "alert",
        alertType: "info",
        content: `\`{ ${propStr} }\``,
      },
    };
  },
  async run({ $ }) {
    const { lineItems } = this;
    $.export("$summary", `Successfully generated ${lineItems.length} items`);
    return lineItems;
  },
};
