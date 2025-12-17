import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-unboost-status",
  name: "Undo Boost of a Status",
  description: "Undo a reshare of a status. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#unreblog)",
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
    const status = await this.mastodon.unboostStatus({
      statusId: this.statusId,
      $,
    });
    $.export("$summary", `Successfully unboosted status with ID ${status.id}`);
    return status;
  },
};
