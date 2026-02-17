import slack from "../../slack.app.mjs";

export default {
  key: "slack-delete-file",
  name: "Delete File",
  description: "Delete a file. [See the documentation](https://api.slack.com/methods/files.delete)",
  version: "0.0.25",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.slack.deleteFiles({
      file: this.file,
    });
    $.export("$summary", `Successfully deleted file with ID ${this.file}`);
    return response;
  },
};
