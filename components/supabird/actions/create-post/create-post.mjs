import { ConfigurationError } from "@pipedream/platform";
import app from "../../supabird.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "supabird-create-post",
  name: "Create Post",
  description: "Schedule a post (or a thread) to X, LinkedIn, Threads, Bluesky, Instagram or TikTok. Choose when it goes out with **When**: the next free posting slot, a specific time, or now. Instagram and TikTok posts need media. Use **List Social Sets** to find a social set ID, and **Unschedule Post** to cancel a scheduled post. [See the documentation](https://api.supabird.io/v1/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    text: {
      type: "string",
      label: "Text",
      description: "The post text, e.g. `Shipping a new feature today`. Required unless **Thread** is set.",
      optional: true,
    },
    thread: {
      type: "string[]",
      label: "Thread",
      description: "Post a thread instead of a single post: 2 to 25 items, the first item is the first post, e.g. `[\"First post\", \"Second post\"]`. Leave **Text** empty when you use this.",
      optional: true,
    },
    when: {
      type: "string",
      label: "When",
      description: "When to publish. `Next free slot` uses your next free posting slot in the next 8 days. `At a specific time` needs **Scheduled At**. `Now` publishes within about a minute.",
      options: constants.WHEN_OPTIONS,
      default: constants.WHEN.NEXT_SLOT,
    },
    scheduledAt: {
      type: "string",
      label: "Scheduled At",
      description: "The time to publish as an ISO 8601 date-time in the future, e.g. `2026-12-01T15:00:00Z`. Only used when **When** is `At a specific time`.",
      optional: true,
    },
    networks: {
      type: "string[]",
      label: "Networks",
      description: "The networks to post to, e.g. `[\"x\", \"linkedin\"]`. Leave empty to post to X only (or, for a social set, to its networks that are on for new posts). `all` posts to every connected network.",
      options: constants.NETWORKS,
      optional: true,
    },
    socialSet: {
      propDefinition: [
        app,
        "socialSet",
      ],
      description: "The social set to post as, e.g. `6af6f28f3d61850002518bfe`. Use **List Social Sets** to find it (the `id` field). Required when your account has several social sets.",
    },
    mediaUrls: {
      type: "string[]",
      label: "Media URLs",
      description: "Up to 4 public image URLs to attach, e.g. `[\"https://example.com/image.png\"]`. Instagram and TikTok posts need media.",
      optional: true,
    },
    linkedinText: {
      type: "string",
      label: "LinkedIn Text",
      description: "Text to use on LinkedIn instead of **Text**, up to 3000 characters, e.g. `A longer version for LinkedIn`.",
      optional: true,
    },
    threadsText: {
      type: "string",
      label: "Threads Text",
      description: "Text to use on Threads instead of **Text**, up to 500 characters, e.g. `A shorter version for Threads`.",
      optional: true,
    },
    blueskyText: {
      type: "string",
      label: "Bluesky Text",
      description: "Text to use on Bluesky instead of **Text**, e.g. `A version for Bluesky`.",
      optional: true,
    },
    instagramText: {
      type: "string",
      label: "Instagram Text",
      description: "Caption to use on Instagram instead of **Text**, up to 2200 characters, e.g. `A caption for Instagram`.",
      optional: true,
    },
    tiktokText: {
      type: "string",
      label: "TikTok Text",
      description: "Caption to use on TikTok instead of **Text**, up to 2200 characters, e.g. `A caption for TikTok`. TikTok also needs media and privacy settings that this action does not send yet, so TikTok posts may be rejected.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app, text, thread, when, scheduledAt, networks, socialSet, mediaUrls,
      linkedinText, threadsText, blueskyText, instagramText, tiktokText,
    } = this;

    const hasThread = Array.isArray(thread) && thread.length > 0;
    if (!text && !hasThread) {
      throw new ConfigurationError("Provide either **Text** or **Thread**.");
    }
    if (text && hasThread) {
      throw new ConfigurationError("Use either **Text** or **Thread**, not both.");
    }
    if (hasThread && (thread.length < 2 || thread.length > 25)) {
      throw new ConfigurationError("**Thread** needs between 2 and 25 items.");
    }
    if (when === constants.WHEN.SCHEDULED_AT && !scheduledAt) {
      throw new ConfigurationError("**Scheduled At** is required when **When** is `At a specific time`.");
    }

    const platformTexts = {
      linkedin: linkedinText,
      threads: threadsText,
      bluesky: blueskyText,
      instagram: instagramText,
      tiktok: tiktokText,
    };
    const hasPlatformTexts = Object.values(platformTexts).some(Boolean);

    let response = await app.createPost({
      $,
      returnFullResponse: true,
      data: {
        text: hasThread
          ? undefined
          : text,
        thread: hasThread
          ? thread
          : undefined,
        next_slot: when === constants.WHEN.NEXT_SLOT
          ? true
          : undefined,
        scheduled_at: when === constants.WHEN.SCHEDULED_AT
          ? scheduledAt
          : undefined,
        post_now: when === constants.WHEN.NOW
          ? true
          : undefined,
        networks: networks?.length
          ? networks
          : undefined,
        social_set: socialSet,
        media_urls: mediaUrls?.length
          ? mediaUrls
          : undefined,
        platform_texts: hasPlatformTexts
          ? platformTexts
          : undefined,
      },
    });

    let result = response.data;
    if (response.status === 202 && result?.job_id) {
      const job = await app.waitForJob({
        $,
        jobId: result.job_id,
        timeoutMs: constants.POST_JOB_TIMEOUT_MS,
      });
      result = job.result ?? job;
    }

    const posts = result?.posts?.length
      ? result.posts
      : [
        result,
      ];
    const ids = posts.map((post) => post?.id).filter(Boolean);
    const status = result?.status ?? "scheduled";
    $.export(
      "$summary",
      posts.length > 1
        ? `Created ${posts.length} posts (${status}): ${ids.join(", ")}`
        : `Created post ${result?.id} (${status}${result?.scheduled_at
          ? ` for ${result.scheduled_at}`
          : ""})`,
    );
    return result;
  },
};
