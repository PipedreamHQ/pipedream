import { ConfigurationError } from "@pipedream/platform";
import slack from "../../slack.app.mjs";
import fs from "fs";

export default {
  key: "slack-upload-file",
  name: "Upload File",
  description: "Upload a file. [See docs here](https://api.slack.com/methods/files.upload)",
  version: "0.0.10",
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
    if (!fs.existsSync(this.content)) {
      throw new ConfigurationError(`\`${this.content}\` not found, is needed a valid \`/tmp\` path`);
    }

    return await this.slack.sdk().files.upload({
      file: fs.createReadStream(this.content),
      channels: this.conversation,
      initial_comment: this.initialComment,
    });
  },
};
