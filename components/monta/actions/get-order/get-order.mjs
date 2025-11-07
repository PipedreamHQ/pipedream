import monta from "../../monta.app.mjs";

export default {
  key: "monta-get-order",
  name: "Get Order",
  description: "Get an order by ID. [See the documentation](https://api-v6.monta.nl/index.html#tag/Info/paths/~1info/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    orderId: {
      propDefinition: [
        monta,
        "orderId",
      ],
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel name if multiple order IDs are avalaible between channels",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.monta.getOrder({
      $,
      orderId: this.orderId,
      params: {
        channel: this.channel,
      },
    });

    $.export("$summary", `Successfully retrieved order with ID \`${this.orderId}\`.`);

    return response;
  },
};
