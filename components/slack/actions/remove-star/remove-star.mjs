import slack from "../../slack.app.mjs";

export default {
  key: "slack-remove-star",
  name: "Remove Star",
  description: "Remove a star from an item on behalf of the authenticated user. [See docs here](https://api.slack.com/methods/stars.remove)",
  version: "0.0.5",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
      optional: true,
    },
    timestamp: {
      propDefinition: [
        slack,
        "timestamp",
      ],
      optional: true,
    },
    file: {
      propDefinition: [
        slack,
        "file",
      ],
      optional: true,
    },
  },
  async run() {
    return await this.slack.sdk().stars.remove({
      channel: this.conversation,
      timestamp: this.timestamp,
      file: this.file,
    });
  },
};
