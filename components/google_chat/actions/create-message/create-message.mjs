import app from "../../google_chat.app.mjs";

export default {
  key: "google_chat-create-message",
  name: "Create Message",
  description: "Create a message to post a text. [See the documentation](https://developers.google.com/chat/api/reference/rest/v1/spaces.messages/create)",
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
    text: {
      type: "string",
      label: "Message Text",
      description: "The text of the message to create.",
    },
  },
  async run({ $ }) {
    const response = await this.app.createMessage({
      $,
      text: this.text,
      spaceId: this.spaceId,
    });
    $.export("$summary", `Successfully created message "${response.name}"`);
    return response;
  },
};
