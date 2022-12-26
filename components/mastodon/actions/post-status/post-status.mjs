import mastodon from "../../mastodon.app.mjs";

export default {
  key: "mastodon-post-status",
  name: "Post Status",
  description: "Publish a status with the given parameters. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#create)",
  version: "0.0.1",
  type: "action",
  props: {
    mastodon,
    status: {
      type: "string",
      label: "Status",
      description: "The text content of the status",
    },
    inReplyToId: {
      type: "string",
      label: "In Reply To ID",
      description: "ID of the status being replied to, if status is a reply",
      optional: true,
    },
    sensitive: {
      type: "boolean",
      label: "Sensitive",
      description: "Mark status and attached media as sensitive? Defaults to false",
      optional: true,
      default: false,
    },
    spoilerText: {
      type: "string",
      label: "Spoiler Text",
      description: "Text to be shown as a warning or subject before the actual content. Statuses are generally collapsed behind this field",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Sets the visibility of the posted status to `public`, `unlisted`, `private`, or `direct`",
      options: [
        "public",
        "unlisted",
        "private",
        "direct",
      ],
      optional: true,
    },
    scheduledAt: {
      type: "string",
      label: "Scheduled At",
      description: "ISO 8601 Datetime at which to schedule a status. Must be at least 5 minutes in the future.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      status: this.status,
      in_reply_to_id: this.inReplyToId,
      sensitive: this.sensitive,
      spoiler_text: this.spoilerText,
      visibility: this.visibility,
      scheduled_at: this.scheduledAt,
    };
    const status = await this.mastodon.postStatus({
      $,
      data,
    });
    $.export("$summary", `Successfully posted new status with ID ${status?.id}`);
    return status;
  },
};
