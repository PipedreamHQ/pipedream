import chatwork from "../../chatwork.app.mjs";

export default {
  key: "chatwork-create-message",
  name: "Create Message",
  description: "Send a message to a specified room. [See the documentation](https://download.chatwork.com/ChatWork_API_Documentation.pdf)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chatwork,
    room: {
      propDefinition: [
        chatwork,
        "room",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "The message body",
    },
    selfUnread: {
      type: "boolean",
      label: "Self Unread",
      description: "Set to `true` to make the messages you posted unread",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.chatwork.createMessage({
      roomId: this.room,
      params: {
        body: this.body,
        self_unread: this.selfUnread
          ? 1
          : 0,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created message with ID ${response.message_id}`);
    }

    return response;
  },
};
