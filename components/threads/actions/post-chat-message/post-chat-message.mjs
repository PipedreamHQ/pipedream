import threads from "../../threads.app.mjs";

export default {
  key: "threads-post-chat-message",
  name: "Post a Chat Message",
  description: "Post a message to a chat. First, make sure you add your Bot user to the chat.",
  version: "0.0.1",
  type: "action",
  props: {
    threads,
    chatID: {
      propDefinition: [
        threads,
        "chatID",
      ],
    },
    body: {
      propDefinition: [
        threads,
        "body",
      ],
      label: "Message",
      description:
        "This is the body of the message. To format the body, you can send markdown.",
    },
  },
  async run({ $ }) {
    const {
      chatID,
      body,
    } = this;
    const chatMessage = await this.threads.postChatMessage({
      $,
      chatID,
      body,
    });

    console.log("chatMessage: ", chatMessage);

    $.export("$summary", `Chat message successfully sent "${chatMessage?.result?.chatMessageID}"`);
    return chatMessage;
  },
};
