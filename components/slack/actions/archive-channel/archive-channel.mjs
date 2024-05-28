import slack from "../../slack.app.mjs";

export default {
  key: "slack-archive-channel",
  name: "Archive Channel",
  description: "Archive a channel. [See the documentation](https://api.slack.com/methods/conversations.archive)",
  version: "0.0.16",
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
  async run({ $ }) {
    const response = await this.slack.sdk().conversations.archive({
      channel: this.conversation,
    });
    $.export("$summary", "Successfully archived channel.");
    return response;
  },
};
