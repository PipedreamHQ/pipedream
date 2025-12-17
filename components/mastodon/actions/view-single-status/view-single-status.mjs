import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-view-single-status",
  name: "View Single Status",
  description: "Obtain information about a status. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#get)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const status = await this.mastodon.getStatus({
      statusId: this.statusId,
      $,
    });
    $.export("$summary", `Successfully retrieved status with ID ${status.id}`);
    return status;
  },
};
