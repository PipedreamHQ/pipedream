import upgradeChat from "../../upgrade_chat.app.mjs";

export default {
  key: "upgrade_chat-list-products",
  name: "List Products",
  description: "Retrieve a list of products. [See the documentation](https://upgrade.chat/developers/documentation)",
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
    const response = await this.upgradeChat.listProducts({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });
    $.export("$summary", `Successfully retrieved ${response?.data?.length} product${response?.data?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
