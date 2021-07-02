const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-create-channel",
  name: "Create a Channel",
  description: "Create a new channel",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    channelName: {
      label: "Channel name",
      description: "Name of the public or private channel to create",
      type: "string",
    },
    isPrivate: {
      label: "Is private?",
      type: "boolean",
      description: "`false` by default. Pass `true` to create a private channel instead of a public one.",
      default: false,
      optional: true,
    },
  },
  async run() {
    const web = this.slack.sdk();
    return await web.conversations.create({
      name: this.channelName,
      is_private: this.isPrivate,
    });
  },
};
