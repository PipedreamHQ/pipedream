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
    paymentId: {
      propDefinition: [
        trolley,
        "paymentId",
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
