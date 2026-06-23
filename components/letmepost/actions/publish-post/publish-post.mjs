import app from "../../letmepost.app.mjs";

export default {
  key: "letmepost-publish-post",
  name: "Publish a Post",
  description: "Publish or schedule a post to one or more connected accounts. [See the documentation](https://docs.letmepost.dev/api-reference/posts/publish-or-schedule-a-multi-target-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    accounts: {
      propDefinition: [
        app,
        "accounts",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The post body. Optional when the post is media-only on platforms that allow it.",
      optional: true,
    },
    media: {
      type: "string[]",
      label: "Media",
      description: "Media attachments. Each item is a JSON object with `kind` (`image` or `video`) and exactly one of `url` or `mediaId`, plus an optional `altText`. Example: `{\"kind\":\"image\",\"url\":\"https://cdn.example.com/launch.jpg\",\"altText\":\"Launch banner\"}`",
      optional: true,
    },
    firstComment: {
      type: "string",
      label: "First Comment",
      description: "Posted as the first comment under the published post, where the platform supports it.",
      optional: true,
    },
    publishNow: {
      type: "boolean",
      label: "Publish Now",
      description: "Publish immediately. Turn off to schedule for a future time.",
      optional: true,
      default: true,
    },
    scheduledAt: {
      type: "string",
      label: "Schedule At",
      description: "When to publish the post (ISO 8601). Required when Publish Now is off.",
      optional: true,
    },
    profileId: {
      type: "string",
      label: "Profile ID",
      description: "Optional profile to attribute this post to.",
      optional: true,
    },
    idempotencyKey: {
      type: "string",
      label: "Idempotency Key",
      description: "Reusing the same key never publishes twice, which makes retries safe.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      accounts,
      text,
      media,
      firstComment,
      publishNow,
      scheduledAt,
      profileId,
      idempotencyKey,
    } = this;

    const publishImmediately = publishNow ?? true;

    if (!publishImmediately && !scheduledAt) {
      throw new Error("A Schedule At time is required when Publish Now is turned off.");
    }

    const body = {
      targets: accounts.map((accountId) => ({
        accountId,
      })),
      publishNow: publishImmediately,
    };

    if (text) {
      body.text = text;
    }
    if (media?.length) {
      body.media = media
        .map((item) => (typeof item === "string"
          ? JSON.parse(item)
          : item))
        .map((item) => {
          const cleaned = {
            kind: item.kind,
          };
          if (item.url) {
            cleaned.url = item.url;
          }
          if (item.mediaId) {
            cleaned.mediaId = item.mediaId;
          }
          if (item.altText) {
            cleaned.altText = item.altText;
          }
          return cleaned;
        });
    }
    if (firstComment) {
      body.firstComment = {
        text: firstComment,
      };
    }
    if (!publishImmediately && scheduledAt) {
      body.scheduledAt = scheduledAt;
    }
    if (profileId) {
      body.profileId = profileId;
    }

    const response = await app.publishPost({
      $,
      data: body,
      headers: idempotencyKey
        ? {
          "Idempotency-Key": idempotencyKey,
        }
        : undefined,
    });

    const targetCount = response.results?.length ?? accounts.length;
    $.export("$summary", `Successfully submitted post \`${response.id}\` to ${targetCount} target(s) with status \`${response.status}\``);

    return response;
  },
};
