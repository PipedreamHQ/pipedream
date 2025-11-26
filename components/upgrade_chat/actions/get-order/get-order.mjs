import upgradeChat from "../../upgrade_chat.app.mjs";

export default {
  key: "upgrade_chat-get-order",
  name: "Get Order",
  description: "Get details of an order. [See the documentation](https://upgrade.chat/developers/documentation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    upgradeChat,
    orderUuid: {
      propDefinition: [
        upgradeChat,
        "orderUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.upgradeChat.getOrder({
      $,
      orderUuid: this.orderUuid,
    });
    $.export("$summary", `Successfully retrieved the details for order with ID: ${this.orderUuid}`);
    return response;
  },
};
