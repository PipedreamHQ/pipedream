import threads from "../../threads.app.mjs";

export default {
  key: "threads-post-chat-message",
  name: "Post a Chat Message",
  description: "Post a message to a chat. First, make sure you add your Bot user to the chat. [See the Documentation](https://github.com/ThreadsHQ/api-documentation#post-chat-message)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        "Compose your chat message here, and include markdown if you'd like. See [here](https://github.com/ThreadsHQ/api-documentation#2-1) for examples.",
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

    $.export("$summary", `Chat message successfully sent "${chatMessage?.result?.chatMessageID}"`);
    return chatMessage;
  },
};
