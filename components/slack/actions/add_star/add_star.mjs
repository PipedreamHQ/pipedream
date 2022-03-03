import slack from "../../slack.app.mjs";

export default {
  key: "slack-add-star",
  name: "Add Star",
  description: "Add a star to an item on behalf of the authenticated user",
  version: "0.0.2",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
      optional: true,
      description: "Channel to add star to, or channel where the message to add star to was posted (used with timestamp).",
    },
    timestamp: {
      propDefinition: [
        slack,
        "timestamp",
      ],
      optional: true,
      description: "Timestamp of the message to add star to.",
    },
    file: {
      propDefinition: [
        slack,
        "file",
      ],
      optional: true,
      description: "File to add star to.",
    },
  },
  async run() {
    return await this.slack.sdk().stars.add({
      conversation: this.conversation,
      timestamp: this.timestamp,
      file: this.file,
    });
  },
};
