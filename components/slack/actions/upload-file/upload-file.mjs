import slack from "../../slack.app.mjs";
import fs from "fs";

export default {
  key: "slack-upload-file",
  name: "Upload File",
  description: "Upload a file. [See docs here](https://api.slack.com/methods/files.upload)",
  version: "0.0.8",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    content: {
      propDefinition: [
        slack,
        "content",
      ],
    },
    initialComment: {
      label: "Report Name",
      description: "Will be added as an initial comment before the image",
      propDefinition: [
        slack,
        "initial_comment",
      ],
      optional: true,
    },
  },
  async run() {
    return await this.slack.sdk().files.upload({
      file: fs.createReadStream(this.content),
      channel: this.conversation,
      initial_comment: this.initialComment,
    });
  },
};
