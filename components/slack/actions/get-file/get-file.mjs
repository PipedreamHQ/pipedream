import slack from "../../slack.app.mjs";

export default {
  key: "slack-get-file",
  name: "Get File",
  description: "Return information about a file. [See the documentation](https://api.slack.com/methods/files.info)",
  version: "0.0.19",
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
    const response = await this.slack.sdk().files.info({
      file: this.file,
    });
    $.export("$summary", `Successfully retrieved file with ID ${this.file}`);
    return response;
  },
};
