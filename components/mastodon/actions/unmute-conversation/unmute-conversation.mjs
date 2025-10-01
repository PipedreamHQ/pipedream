import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-unmute-conversation",
  name: "Unmute a Conversation",
  description: "Start receiving notifications again for the thread that this status is part of. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#unmute)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mastodon,
    statusId: {
      propDefinition: [
        mastodon,
        "statusId",
      ],
    },
  },
  async run({ $ }) {
    const status = await this.mastodon.unmuteConversation({
      statusId: this.statusId,
      $,
    });
    $.export("$summary", `Successfully unmuted conversation with status ID ${status.id}`);
    return status;
  },
};
