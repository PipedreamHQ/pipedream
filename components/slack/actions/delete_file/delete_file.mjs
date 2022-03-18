import slack from "../../slack.app.mjs";

export default {
  key: "slack-delete-file",
  name: "Delete File",
  description: "Delete a file",
  version: "0.0.3",
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
