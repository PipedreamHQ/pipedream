import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-delete-status",
  name: "Delete Status",
  description: "Delete one of your own statuses. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#delete)",
  version: "0.0.3",
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
        "userStatusId",
      ],
    },
  },
  async run({ $ }) {
    const status = await this.mastodon.deleteStatus({
      statusId: this.statusId,
      $,
    });
    $.export("$summary", `Successfully deleted status with ID ${status.id}`);
    return status;
  },
};
