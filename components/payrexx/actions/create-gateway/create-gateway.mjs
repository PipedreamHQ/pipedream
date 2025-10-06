import payrexx from "../../payrexx.app.mjs";

export default {
  key: "payrexx-create-gateway",
  name: "Create Gateway",
  description: "Create a new gateway. [See the documentation](https://developers.payrexx.com/reference/create-a-gateway)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    payrexx,
    amount: {
      propDefinition: [
        payrexx,
        "amount",
      ],
    },
    currency: {
      propDefinition: [
        payrexx,
        "currency",
      ],
    },
    sku: {
      propDefinition: [
        payrexx,
        "sku",
      ],
    },
    purpose: {
      propDefinition: [
        payrexx,
        "purpose",
      ],
    },
    vatRate: {
      propDefinition: [
        payrexx,
        "vatRate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.payrexx.createGateway({
      $,
      data: {
        amount: this.amount,
        currency: this.currency,
        sku: this.sku,
        purpose: this.purpose,
        vatRate: this.vatRate,
      },
    });

    $.export("$summary", `Successfully created gateway with ID: ${response.data[0]?.id}`);
    return response;
  },
};
