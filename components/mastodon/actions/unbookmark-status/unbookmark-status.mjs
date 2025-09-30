import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-unbookmark-status",
  name: "Undo Bookmark of a Status",
  description: "Remove a status from your private bookmarks. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#unbookmark)",
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
        "bookmarkedStatusId",
      ],
    },
  },
  async run({ $ }) {
    const status = await this.mastodon.unbookmarkStatus({
      statusId: this.statusId,
      $,
    });
    $.export("$summary", `Successfully removed bookmark of status with ID ${status.id}`);
    return status;
  },
};
