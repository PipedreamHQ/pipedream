import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-favorite-status",
  name: "Favorite Status",
  description: "Add a status to your favourites list. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#favourite)",
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
    const status = await this.mastodon.favoriteStatus({
      statusId: this.statusId,
      $,
    });
    $.export("$summary", `Successfully favorited status with ID ${status.id}`);
    return status;
  },
};
