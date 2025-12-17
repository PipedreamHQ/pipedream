import app from "../../google_chat.app.mjs";

export default {
  key: "google_chat-get-message",
  name: "Get Message",
  description: "Returns details about a message. [See the documentation](https://developers.google.com/chat/api/reference/rest/v1/spaces.messages/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    spaceId: {
      propDefinition: [
        app,
        "spaceId",
      ],
    },
    messageId: {
      propDefinition: [
        app,
        "messageId",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getMessage({
      $,
      spaceId: this.spaceId,
      messageId: this.messageId,
    });
    $.export("$summary", `Successfully fetched message "${response.name}"`);
    return response;
  },
};
