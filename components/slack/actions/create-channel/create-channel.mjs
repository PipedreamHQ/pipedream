import slack from "../../slack.app.mjs";

export default {
  key: "slack-create-channel",
  name: "Create a Channel",
  description: "Create a new channel. [See the documentation](https://api.slack.com/methods/conversations.create)",
  version: "0.0.19",
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
  async run({ $ }) {
    // parse name
    const name = this.channelName.replace(/\s+/g, "-").toLowerCase();

    const response = await this.slack.sdk().conversations.create({
      name,
      is_private: this.isPrivate,
    });
    $.export("$summary", `Successfully created channel ${this.channelName}`);
    return response;
  },
};
