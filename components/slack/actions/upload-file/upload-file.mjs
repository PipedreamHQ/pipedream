import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import slack from "../../slack.app.mjs";

export default {
  key: "slack-upload-file",
  name: "Upload File",
  description: "Upload a file. [See the documentation](https://api.slack.com/methods/files.upload)",
  version: "0.0.22",
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
      description: "Will be added as an initial comment before the image",
      propDefinition: [
        slack,
        "initial_comment",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!fs.existsSync(this.content)) {
      throw new ConfigurationError(`\`${this.content}\` not found, a valid \`/tmp\` path is needed`);
    }
    const response = await this.slack.sdk().filesUploadV2({
      file: fs.createReadStream(this.content),
      channel_id: this.conversation,
      initial_comment: this.initialComment,
      filename: this.content.split("/").pop(),
    });
    $.export("$summary", "Successfully uploaded file");
    return response;
  },
};
