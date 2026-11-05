import { ConfigurationError } from "@pipedream/platform";
import app from "../../postpulse.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "postpulse-create-post",
  name: "Create Post",
  description: "Publish a post now or schedule it for later on one connected account: Instagram, Facebook, YouTube, TikTok, Threads, LinkedIn, Pinterest, X, Bluesky or Telegram. Use **List Accounts** to find account IDs and **Upload Media From URL** to get media paths. [See the documentation](https://post-pulse.com/api-docs#post-scheduling)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    chatId: {
      propDefinition: [
        app,
        "chatId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "Text of the post",
      optional: true,
    },
    mediaPaths: {
      type: "string[]",
      label: "Media Paths",
      description: "Media `path` values returned by **Upload Media From URL**",
      optional: true,
    },
    scheduledTime: {
      type: "string",
      label: "Scheduled Time",
      description: "When to publish, as an ISO 8601 timestamp, e.g. `2026-12-01T10:00:00Z`. Leave empty to publish now",
      optional: true,
    },
    publicationType: {
      type: "string",
      label: "Publication Type",
      description: "Instagram and Facebook only. Defaults to `FEED`",
      options: constants.PUBLICATION_TYPES,
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title for a YouTube or TikTok video, or a Pinterest Pin",
      optional: true,
    },
    tiktokPrivacyLevel: {
      type: "string",
      label: "TikTok Privacy Level",
      description: "TikTok only: who can see the video",
      options: constants.TIKTOK_PRIVACY_LEVELS,
      optional: true,
    },
  },
  methods: {
    buildPlatformSettings(platform) {
      const settings = {
        type: constants.SETTINGS_TYPE_BY_PLATFORM[platform] || platform,
      };
      if ([
        "INSTAGRAM",
        "FACEBOOK",
        "FACEBOOK_PAGE",
      ].includes(platform)) {
        settings.publicationType = this.publicationType || "FEED";
      } else if ([
        "YOUTUBE",
        "PINTEREST",
      ].includes(platform)) {
        settings.title = this.title;
      } else if (platform === "TIKTOK") {
        settings.title = this.title;
        settings.privacyLevel = this.tiktokPrivacyLevel;
        settings.hasUsageConfirmation = true;
      }
      return settings;
    },
  },
  async run({ $ }) {
    const accounts = await this.app.listAccounts({
      $,
    });
    const account = accounts.find(({ id }) => id === this.accountId);
    if (!account) {
      throw new ConfigurationError(`Account ${this.accountId} is not connected to PostPulse. Use **List Accounts** to find a valid account ID.`);
    }
    if (constants.CHAT_PLATFORMS.includes(account.platform) && !this.chatId) {
      throw new ConfigurationError(`Destination is required for ${account.platform} accounts.`);
    }

    const response = await this.app.createPost({
      $,
      data: {
        scheduledTime: this.scheduledTime,
        isDraft: false,
        publications: [
          {
            socialMediaAccountId: this.accountId,
            platformSettings: this.buildPlatformSettings(account.platform),
            posts: [
              {
                content: this.content,
                chatId: this.chatId,
                attachmentPaths: this.mediaPaths?.length
                  ? this.mediaPaths
                  : undefined,
              },
            ],
          },
        ],
      },
    });
    $.export("$summary", `${this.scheduledTime
      ? "Scheduled"
      : "Published"} post ${response.id} on ${account.platform}`);
    return response;
  },
};
