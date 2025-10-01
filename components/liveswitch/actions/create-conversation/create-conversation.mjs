import app from "../../liveswitch.app.mjs";

export default {
  key: "liveswitch-create-conversation",
  name: "Create Conversation",
  description: "Create a conversation in LiveSwitch [See the documentation](https://developer.liveswitch.com/reference/post_v1-conversations)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.createConversation({
      $,
      data: {
        contactId: this.contactId,
        message: this.message,
      },
    });

    $.export("$summary", `Successfully created Conversation with ID: ${response.id}`);

    return response;
  },
};
