import payrexx from "../../payrexx.app.mjs";

export default {
  key: "payrexx-create-paylink",
  name: "Create Paylink",
  description: "Create a paylink. [See the documentation](https://developers.payrexx.com/reference/create-a-paylink)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    payrexx,
    title: {
      type: "string",
      label: "Title",
      description: "This is the page title which will be shown on the payment page",
    },
    description: {
      type: "string",
      label: "Description",
      description: "This is a description which will be shown on the payment page",
    },
    referenceId: {
      type: "string",
      label: "Reference ID",
      description: "An internal reference id used by your system",
    },
    purpose: {
      propDefinition: [
        payrexx,
        "purpose",
      ],
    },
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
    vatRate: {
      propDefinition: [
        payrexx,
        "vatRate",
      ],
    },
    sku: {
      propDefinition: [
        payrexx,
        "sku",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.payrexx.createPaylink({
      $,
      data: {
        title: this.title,
        description: this.description,
        referenceId: this.referenceId,
        purpose: this.purpose,
        amount: this.amount,
        currency: this.currency,
        vatRate: this.vatRate,
        sku: this.sku,
      },
    });

    $.export("$summary", `Successfully created paylink with ID: ${response.data[0]?.id}`);
    return response;
  },
};
