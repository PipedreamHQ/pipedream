const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-list-channels",
  name: "List Channels",
  description: "Return a list of all channels in a workspace",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
  },
  async run() {
    return await this.slack.sdk().conversations.list();
  },
};
