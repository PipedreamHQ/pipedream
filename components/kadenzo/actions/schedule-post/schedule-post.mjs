import kadenzo from "../../kadenzo.app.mjs";

export default {
  key: "kadenzo-schedule-post",
  name: "Schedule a Post",
  description:
    "Schedule a social media post to one or more connected accounts at a future time. [See the docs](https://studio.kadenzo.app/developers).",
  version: "0.0.1",
  type: "action",
  props: {
    kadenzo,
    accountIds: {
      propDefinition: [kadenzo, "accountIds"],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The post text. Optional only if you provide Media URLs.",
      optional: true,
    },
    scheduledFor: {
      type: "string",
      label: "Scheduled For",
      description:
        "When to publish, as an ISO 8601 timestamp that must be in the future — e.g. `2026-07-01T09:00:00Z`.",
    },
    mediaUrls: {
      type: "string[]",
      label: "Media URLs",
      description:
        "Optional public image/video URLs to attach. Google Drive / Dropbox share links work when public; a direct URL is most reliable.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      account_ids: this.accountIds,
      scheduled_for: this.scheduledFor,
    };
    if (this.content) data.content = this.content;
    if (this.mediaUrls?.length) data.media_urls = this.mediaUrls;

    const response = await this.kadenzo.schedulePost({ $, data });
    $.export("$summary", `Scheduled post ${response.id} for ${response.scheduled_for}`);
    return response;
  },
};
