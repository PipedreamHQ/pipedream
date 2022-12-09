import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-members-in-channel",
  name: "List Members in Channel",
  description: "Retrieve members of a channel. [See docs here](https://api.slack.com/methods/conversations.members)",
  version: "0.0.8",
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
    return await this.slack.sdk().conversations.members({
      channel: this.conversation,
    });
  },
};
