import insertchat from "../../insertchat.app.mjs";

export default {
  key: "insertchat-push-message-existing-chat",
  name: "Push Message to Existing Chat",
  description: "Pushes a new message into an existing chat session in InsertChat. [See the documentation](https://www.postman.com/gold-star-239225/insertchat/request/me7mcwa/push-a-message-into-a-chat-session)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    insertchat,
    chatbotId: {
      propDefinition: [
        insertchat,
        "chatbotId",
      ],
    },
    chatSessionId: {
      propDefinition: [
        insertchat,
        "chatSessionId",
        (c) => ({
          chatbotId: c.chatbotId,
        }),
      ],
    },
    role: {
      type: "string",
      label: "Role",
      description: "Role to send message as",
      options: [
        "user",
        "assistant",
      ],
    },
    message: {
      type: "string",
      label: "Message Content",
      description: "The content of the message to be pushed into the chat session",
    },
  },
  run({ $ }) {
    // method works, but times out if we await the response
    this.insertchat.pushMessage({
      $,
      data: new URLSearchParams({
        widget_uid: this.chatbotId,
        chat_uid: this.chatSessionId,
        role: this.role,
        input: this.message,
      }),
    });
    $.export("$summary", `Successfully pushed message to chat session ${this.chatSessionId}`);
    // nothing to return
  },
};
