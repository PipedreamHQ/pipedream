import slack from "../../slack.app.mjs";

export default {
  key: "slack-get-file",
  name: "Get File",
  description: "Return information about a file. [See docs here](https://api.slack.com/methods/files.info)",
  version: "0.0.16",
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
    return await this.slack.sdk().files.info({
      file: this.file,
    });
  },
};
