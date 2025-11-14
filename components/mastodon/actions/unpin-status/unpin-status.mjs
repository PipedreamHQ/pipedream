import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-unpin-status",
  name: "Unpin Status from Profile",
  description: "Unfeature a status from the top of your profile. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#unpin)",
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
        "userStatusId",
        () => ({
          pinned: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const status = await this.mastodon.unPinStatus({
      statusId: this.statusId,
      $,
    });
    $.export("$summary", `Successfully unpinned status with ID ${status.id} from profile.`);
    return status;
  },
};
