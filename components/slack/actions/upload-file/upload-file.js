const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-upload-file",
  name: "Upload File",
  description: "Upload a file",
  version: "0.0.1",
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
