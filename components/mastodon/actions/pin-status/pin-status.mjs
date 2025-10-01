import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-pin-status",
  name: "Pin Status to Profile",
  description: "Feature one of your own public statuses at the top of your profile. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#pin)",
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
        "userStatusId",
      ],
    },
  },
  async run({ $ }) {
    const status = await this.mastodon.pinStatus({
      statusId: this.statusId,
      $,
    });
    $.export("$summary", `Successfully pinned status with ID ${status.id} to profile.`);
    return status;
  },
};
