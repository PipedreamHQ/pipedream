import slack from "../../slack.app.mjs";

export default {
  key: "slack-delete-file",
  name: "Delete File",
  description: "Delete a file. [See the documentation](https://api.slack.com/methods/files.delete)",
  version: "0.0.18",
  type: "action",
  props: {
    slack,
    file: {
      propDefinition: [
        slack,
        "file",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.slack.sdk().files.delete({
      file: this.file,
    });
    $.export("$summary", `Successfully deleted file with ID ${this.file}`);
    return response;
  },
};
