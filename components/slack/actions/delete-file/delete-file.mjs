import slack from "../../slack.app.mjs";

export default {
  key: "slack-delete-file",
  name: "Delete File",
  description: "Delete a file. [See docs here](https://api.slack.com/methods/files.delete)",
  version: "0.0.9",
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
  async run() {
    return await this.slack.sdk().files.delete({
      file: this.file,
    });
  },
};
