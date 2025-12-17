import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-edit-status",
  name: "Edit Status",
  description: "Edit a given status to change its text or sensitivity. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#edit)",
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
    status: {
      propDefinition: [
        mastodon,
        "status",
      ],
      optional: true,
    },
    sensitive: {
      propDefinition: [
        mastodon,
        "sensitive",
      ],
    },
    spoilerText: {
      propDefinition: [
        mastodon,
        "spoilerText",
      ],
    },
  },
  async run({ $ }) {
    const status = await this.mastodon.getStatus({
      statusId: this.statusId,
      $,
    });
    const previousStatusTextOnly = status.content.replace(/<[^>]*>/g, "");
    const data = {
      status: this.status || previousStatusTextOnly,
      sensitive: this.sensitive !== undefined
        ? this.sensitive
        : status.sensitive,
      spoiler_text: this.spoilerText || status.spoiler_text,
    };
    const result = await this.mastodon.editStatus({
      statusId: this.statusId,
      data,
      $,
    });
    $.export("$summary", `Successfully updated status with ID ${result.id}.`);
    return result;
  },
};
