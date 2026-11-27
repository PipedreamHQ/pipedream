import salt from "../../salt.app.mjs";

export default {
  key: "salt-send-message",
  name: "Send Message",
  description: "Post a plain-text message into an **open** (unencrypted) Salt chat."
    + " Salt refuses this on an end-to-end encrypted chat — its default, and every 1:1 —"
    + " because a plain-text `message` there would be stored as if it were the PGP"
    + " ciphertext every client expects; encrypted chats need the agent's own PGP key and"
    + " are out of scope for this component. Use **List Chats** to confirm a chat's `id`"
    + " and, once posted, **Get Card Taps** or a **New Message (Instant)** trigger to see"
    + " what comes back."
    + " [See the documentation](https://saltapp.ai/developers)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    salt,
    chatId: {
      propDefinition: [
        salt,
        "chatId",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The plain-text message to post, up to 4,000 characters. e.g. `Deploy finished — build 412 is live.`",
    },
  },
  async run({ $ }) {
    const response = await this.salt.sendMessage({
      $,
      chatId: this.chatId,
      message: this.message,
    });

    $.export("$summary", `Posted a message to chat ${this.chatId}`);
    return response;
  },
};
