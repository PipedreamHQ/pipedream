// x-pd-ai: optimized
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-get-file",
  name: "Get File",
  description: "Return information about a file. [See the documentation](https://api.slack.com/methods/files.info)",
  version: "0.1.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    addToChannel: {
      propDefinition: [
        slack,
        "addToChannel",
      ],
    },
    file: {
      propDefinition: [
        slack,
        "file",
      ],
    },
  },
  async run({ $ }) {
    if (this.addToChannel) {
      await this.slack.maybeAddAppToChannels([
        this.conversation,
      ]);
    }

    const response = await this.slack.getFileInfo({
      file: this.file,
    });
    $.export("$summary", `Successfully retrieved file with ID ${this.file}`);
    return response;
  },
};
