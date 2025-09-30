import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-unfavorite-status",
  name: "Undo Favorite of a Status",
  description: "Remove a status from your favourites list.. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#unfavourite)",
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
        "favoriteStatusId",
      ],
    },
  },
  async run({ $ }) {
    const status = await this.mastodon.unfavoriteStatus({
      statusId: this.statusId,
      $,
    });
    $.export("$summary", `Successfully unfavorited status with ID ${status.id}`);
    return status;
  },
};
