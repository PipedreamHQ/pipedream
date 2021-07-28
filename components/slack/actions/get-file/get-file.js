const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-get-file",
  name: "Get File",
  description: "Return information about a file",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    file: {
      propDefinition: [
        slack,
        "file",
      ],
    },
    count: {
      propDefinition: [
        slack,
        "count",
      ],
    },
  },
  async run() {
    return await this.slack.sdk().files.info({
      file: this.file,
      count: this.count,
    });
  },
};
