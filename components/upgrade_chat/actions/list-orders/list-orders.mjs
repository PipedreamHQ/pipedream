import upgradeChat from "../../upgrade_chat.app.mjs";

export default {
  key: "upgrade_chat-list-orders",
  name: "List Orders",
  description: "Retrieve a list of orders. [See the documentation](https://upgrade.chat/developers/documentation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    upgradeChat,
    limit: {
      propDefinition: [
        upgradeChat,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        upgradeChat,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.upgradeChat.listOrders({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });
    $.export("$summary", `Successfully retrieved ${response?.data?.length} order${response?.data?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
