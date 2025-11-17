import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-bookmark-status",
  name: "Bookmark Status",
  description: "Privately bookmark a status. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#bookmark)",
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
    const status = await this.mastodon.bookmarkStatus({
      statusId: this.statusId,
      $,
    });
    $.export("$summary", `Successfully bookmarked status with ID ${status.id}`);
    return status;
  },
};
