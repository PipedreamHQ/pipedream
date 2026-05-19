import trolley from "../../trolley.app.mjs";

export default {
  key: "trolley-retrieve-payment",
  name: "Retrieve Payment",
  description: "Retrieve a payment by its ID. [See the documentation](https://developers.trolley.com/api/#retrieve-a-payment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trolley,
    batchId: {
      propDefinition: [
        trolley,
        "batchId",
      ],
      optional: true,
      description: "Optionally select a batch to filter the **Payment ID** dropdown. Leave blank to enter a Payment ID directly.",
      reloadProps: true,
    },
    paymentId: {
      propDefinition: [
        trolley,
        "paymentId",
        (c) => ({
          batchId: c.batchId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.trolley.getPayment({
      $,
      paymentId: this.paymentId,
    });
    $.export("$summary", `Successfully retrieved payment ${this.paymentId}`);
    return response;
  },
};
