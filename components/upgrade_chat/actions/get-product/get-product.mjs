import upgradeChat from "../../upgrade_chat.app.mjs";

export default {
  key: "upgrade_chat-get-product",
  name: "Get Product",
  description: "Get details of a product. [See the documentation](https://upgrade.chat/developers/documentation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    upgradeChat,
    productUuid: {
      propDefinition: [
        upgradeChat,
        "productUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.upgradeChat.getProduct({
      $,
      productUuid: this.productUuid,
    });
    $.export("$summary", `Successfully retrieved the details for product with ID: ${this.productUuid}`);
    return response;
  },
};
