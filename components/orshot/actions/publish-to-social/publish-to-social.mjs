import { ConfigurationError } from "@pipedream/platform";
import orshot from "../../orshot.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import { SOCIAL_POST_STATUSES } from "../../common/constants.mjs";

export default {
  key: "orshot-publish-to-social",
  name: "Publish to Social",
  description: "Publish an image or video URL (e.g. from a render) to connected social accounts, now, as a draft, or on a schedule. [See the documentation](https://orshot.com/docs/api-reference/social-publish)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    orshot,
    accounts: {
      propDefinition: [
        orshot,
        "socialAccountIds",
      ],
    },
    content: {
      type: "string",
      label: "Caption",
      description: "Caption or text for the post (max 5000 characters)",
      optional: true,
    },
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "URL of the image or video to publish",
      optional: true,
    },
    mediaUrls: {
      type: "string[]",
      label: "Media URLs",
      description: "Several media URLs for a carousel post. Use this instead of `Media URL`.",
      optional: true,
    },
    status: {
      type: "string",
      label: "When",
      description: "`published` posts now, `draft` holds it in Orshot, `scheduled` posts at `Scheduled For`",
      options: SOCIAL_POST_STATUSES,
      optional: true,
      default: "published",
    },
    scheduledFor: {
      type: "string",
      label: "Scheduled For",
      description: "ISO 8601 timestamp at least 60 seconds ahead, e.g. `2030-01-15T10:00:00Z`. Required when `When` is `scheduled`.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "IANA timezone for scheduling, e.g. `America/New_York`",
      optional: true,
    },
    platformOptions: {
      type: "object",
      label: "Platform Options",
      description: "Per-account options keyed by account ID, e.g. `{ \"1\": { \"firstComment\": \"Follow us\" }, \"2\": { \"title\": \"Launch\", \"link\": \"https://acme.com\" } }`",
      optional: true,
    },
    tiktokSettings: {
      type: "object",
      label: "TikTok Settings",
      description: "Root-level TikTok options, e.g. `{ \"autoAddMusic\": true }` for photo carousels",
      optional: true,
    },
  },
  async run({ $ }) {
    const accounts = (this.accounts || []).map((id) => {
      const n = Number(id);
      return Number.isInteger(n)
        ? n
        : id;
    });
    if (!accounts.length) {
      throw new ConfigurationError("Select at least one social account");
    }
    if (this.mediaUrl && this.mediaUrls?.length) {
      throw new ConfigurationError("Set either `Media URL` or `Media URLs`, not both");
    }
    const status = this.status || "published";
    if (status === "scheduled" && !this.scheduledFor) {
      throw new ConfigurationError("`Scheduled For` is required when `When` is `scheduled`");
    }
    if (status !== "scheduled" && this.scheduledFor) {
      throw new ConfigurationError("`Scheduled For` only applies when `When` is `scheduled`");
    }

    const data = {
      accounts,
      status,
    };
    if (this.content) data.content = this.content;
    if (this.mediaUrl) data.media_url = this.mediaUrl;
    if (this.mediaUrls?.length) data.media_urls = this.mediaUrls;
    if (this.scheduledFor) data.scheduled_for = this.scheduledFor;
    if (this.timezone) data.timezone = this.timezone;
    const platformOptions = parseObject(this.platformOptions);
    if (Object.keys(platformOptions).length) data.platformOptions = platformOptions;
    const tiktokSettings = parseObject(this.tiktokSettings);
    if (Object.keys(tiktokSettings).length) data.tiktokSettings = tiktokSettings;

    const response = await this.orshot.publishToSocial({
      $,
      data,
    });
    $.export("$summary", `Social post ${response?.data?.post_id} is ${response?.data?.status ?? status}`);
    return response;
  },
};
