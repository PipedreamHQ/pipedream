import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-boost-status",
  name: "Boost Status",
  description: "Reshare a status on your own profile. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#boost)",
  version: "0.0.2",
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
    const status = await this.mastodon.boostStatus({
      statusId: this.statusId,
      $,
    });
    $.export("$summary", `Successfully boosted status with ID ${status.id}`);
    return status;
  },
};
