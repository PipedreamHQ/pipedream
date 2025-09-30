import app from "../../z_api.app.mjs";

export default {
  key: "z_api-modify-chat",
  name: "Modify Chat",
  description: "Modify the specified chat. [See the documentation](https://developer.z-api.io/en/chats/delete-chat)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    pageNum: {
      propDefinition: [
        app,
        "pageNum",
      ],
    },
    chat: {
      propDefinition: [
        app,
        "chat",
        (c) => ({
          pageNum: c.pageNum,
        }),
      ],
    },
    action: {
      propDefinition: [
        app,
        "action",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.modifyChat({
      $,
      data: {
        phone: this.chat,
        action: this.action,
      },
    });
    $.export("$summary", "Successfully modified chat with number: " + this.chat);
    return response;
  },
};
