import snatchbot from "../../snatchbot.app.mjs";

export default {
  key: "snatchbot-post-message",
  name: "Post Message",
  description: "Post a new message and receive a response from your bot. [See the documentation](https://support.snatchbot.me/reference/post-message)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    snatchbot,
    userId: {
      propDefinition: [
        snatchbot,
        "userId",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The text you want to send",
    },
  },
  async run({ $ }) {
    const response = await this.snatchbot.postMessage({
      params: {
        user_id: this.userId,
      },
      data: {
        message: this.message,
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully posted message.");
    }

    return response;
  },
};
