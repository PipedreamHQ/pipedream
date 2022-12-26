import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-unfavorite-status",
  name: "Undo Favorite of a Status",
  description: "Remove a status from your favourites list.. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#unfavourite)",
  version: "0.0.1",
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
    const status = await this.mastodon.unfavoriteStatus({
      statusId: this.statusId,
      $,
    });
    $.export("$summary", `Successfully unfavorited status with ID ${status.id}`);
    return status;
  },
};
