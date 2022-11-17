import slack from "../../slack.app.mjs";

export default {
  key: "slack-archive-channel",
  name: "Archive Channel",
  description: "Archive a channel. [See docs here](https://api.slack.com/methods/conversations.archive)",
  version: "0.0.7",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
  },
  async run() {
    console.log('Should fail when version is not bump up')
    return await this.slack.sdk().conversations.archive({
      channel: this.conversation,
    });
  },
};
