import slack from "../../slack.app.mjs";

export default {
  key: "slack-get-file",
  name: "Get File",
  description: "Return information about a file. [See the documentation](https://api.slack.com/methods/files.info)",
  version: "0.0.25",
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
    file: {
      propDefinition: [
        slack,
        "file",
        (c) => ({
          channel: c.conversation,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.slack.getFileInfo({
      file: this.file,
    });
    $.export("$summary", `Successfully retrieved file with ID ${this.file}`);
    return response;
  },
};
