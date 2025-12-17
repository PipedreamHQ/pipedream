import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-mute-conversation",
  name: "Mute Conversation",
  description: "Do not receive notifications for the thread that this status is part of. Must be a thread in which you are a participant. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#mute)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
    const status = await this.mastodon.muteConversation({
      statusId: this.statusId,
      $,
    });
    $.export("$summary", `Successfully muted conversation with status ID ${status.id}`);
    return status;
  },
};
