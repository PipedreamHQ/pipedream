import paymos from "../../paymos.app.mjs";

export default {
  key: "paymos-get-payment-channel",
  name: "Get Payment Channel",
  description: "Retrieve a Paymos payment channel by ID along with its provisioned deposit addresses and minimums. [See the documentation](https://paymos.io/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    paymos,
    channelId: {
      propDefinition: [
        paymos,
        "channelId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paymos.getPaymentChannel({
      $,
      channelId: this.channelId,
    });
    $.export("$summary", `Successfully retrieved payment channel ${this.channelId}`);
    return response;
  },
};
