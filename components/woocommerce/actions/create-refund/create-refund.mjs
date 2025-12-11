import app from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-create-refund",
  name: "Create Refund",
  description: "Create a new refund for an order. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/#create-a-refund)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The total refund amount. If not specified, the amount will be calculated based on the line items",
      optional: true,
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "Reason for the refund",
      optional: true,
    },
    apiRefund: {
      type: "boolean",
      label: "API Refund",
      description: "When true, the payment gateway API is used to generate the refund. When false, the refund is manual",
      optional: true,
    },
    lineItems: {
      type: "string[]",
      label: "Line Items",
      description: `Array of line items to refund. Each item must be a JSON string with the following structure:

**Properties:**
- \`id\` (integer, required): The ID of the line item in the order
- \`refund_total\` (number, required): The amount to refund for this line item, excluding taxes
- \`refund_tax\` (array, optional): Array of tax refund objects, each containing:
  - \`id\` (integer): The ID of the tax rate
  - \`refund_total\` (number): The amount of tax to refund

**Example:**
\`\`\`json
{
  "id": 111,
  "refund_total": 10,
  "refund_tax": [
    {
      "id": 222,
      "refund_total": 20
    }
  ]
}
\`\`\``,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      ...Object.fromEntries(
        Object.entries({
          amount: this.amount,
          reason: this.reason,
          api_refund: this.apiRefund,
          line_items: this.lineItems?.map((item) => typeof item === "string"
            ? JSON.parse(item)
            : item),
        }).filter(([
          ,
          v,
        ]) => v !== undefined),
      ),
    };

    try {
      const response = await this.app.createRefund({
        orderId: this.orderId,
        data,
      });

      $.export("$summary", `Successfully created refund ID: ${response.id} for $${response.amount}`);

      return response;

    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  },
};
