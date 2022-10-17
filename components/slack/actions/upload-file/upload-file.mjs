import slack from "../../slack.app.mjs";

export default {
  key: "slack-upload-file",
  name: "Upload File",
  description: "Upload a file. [See docs here](https://api.slack.com/methods/files.upload)",
  version: "0.0.6",
  type: "action",
  props: {
    slack,
    content: {
      propDefinition: [
        slack,
        "content",
      ],
    },
    initial_comment: {
      propDefinition: [
        slack,
        "initial_comment",
      ],
      optional: true,
    },
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
  },
  async run() {
    return await this.slack.sdk().files.upload({
      content: this.content,
      channel: this.conversation,
      initial_comment: this.initial_comment,
    });
  },
};
