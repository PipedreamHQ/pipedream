import blotato from "../../blotato.app.mjs";

export default {
  key: "blotato-create-post",
  name: "Create Post",
  description: "Posts to a social media platform. [See documentation](https://help.blotato.com/api/api-reference/publish-post)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    blotato,
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the connected account for publishing the post",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The main textual content of the post",
    },
    mediaUrls: {
      type: "string[]",
      label: "Media URLs",
      description: "An array of media URLs attached to the post. The URLs must originate from the blotato.com domain. See the Upload Media section for more info.",
    },
    targetType: {
      type: "string",
      label: "Target Type",
      description: "The target platform type",
      options: [
        "webhook",
        "twitter",
        "linkedin",
        "facebook",
        "instagram",
        "pinterest",
        "tiktok",
        "threads",
        "bluesky",
        "youtube",
      ],
      reloadProps: true,
    },
    additionalPosts: {
      type: "string",
      label: "Additional Posts",
      description: "A JSON array of additional posts for thread-like posts (e.g., Twitter, Bluesky, Threads). Each post should have `text` and `mediaUrls` properties. Example: `[{\"text\": \"Second post\", \"mediaUrls\": []}]`",
      optional: true,
    },
    scheduledTime: {
      type: "string",
      label: "Scheduled Time",
      description: "The timestamp (ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`) when the post should be published. If not provided, the post will be published immediately.",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};

    switch (this.targetType) {
    case "webhook":
      props.webhookUrl = {
        type: "string",
        label: "Webhook URL",
        description: "The webhook URL to send the post data",
      };
      break;
    case "linkedin":
      props.linkedinPageId = {
        type: "string",
        label: "LinkedIn Page ID",
        description: "Optional LinkedIn Page ID",
        optional: true,
      };
      break;
    case "facebook":
      props.facebookPageId = {
        type: "string",
        label: "Facebook Page ID",
        description: "Facebook Page ID",
      };
      props.facebookMediaType = {
        type: "string",
        label: "Media Type",
        description: "Determines whether the video will be uploaded as a regular video or a reel. Only applicable if one of the media URLs is a video.",
        options: [
          "video",
          "reel",
        ],
        optional: true,
      };
      break;
    case "instagram":
      props.instagramMediaType = {
        type: "string",
        label: "Media Type",
        description: "Is it a story or a reel? Reels are video only and cannot appear in carousel items. The default value is `reel`.",
        options: [
          "reel",
          "story",
        ],
        optional: true,
        default: "reel",
      };
      props.instagramAltText = {
        type: "string",
        label: "Alt Text",
        description: "Alternative text, up to 1000 characters, for an image. Only supported on a single image or image media in a carousel.",
        optional: true,
      };
      break;
    case "tiktok":
      props.tiktokPrivacyLevel = {
        type: "string",
        label: "Privacy Level",
        description: "Privacy level of the post",
        options: [
          "SELF_ONLY",
          "PUBLIC_TO_EVERYONE",
          "MUTUAL_FOLLOW_FRIENDS",
          "FOLLOWER_OF_CREATOR",
        ],
      };
      props.tiktokDisabledComments = {
        type: "boolean",
        label: "Disabled Comments",
        description: "If true, comments will be disabled",
      };
      props.tiktokDisabledDuet = {
        type: "boolean",
        label: "Disabled Duet",
        description: "If true, duet will be disabled",
      };
      props.tiktokDisabledStitch = {
        type: "boolean",
        label: "Disabled Stitch",
        description: "If true, stitch will be disabled",
      };
      props.tiktokIsBrandedContent = {
        type: "boolean",
        label: "Is Branded Content",
        description: "If true, the post is branded content",
      };
      props.tiktokIsYourBrand = {
        type: "boolean",
        label: "Is Your Brand",
        description: "If true, the content belongs to your brand",
      };
      props.tiktokIsAiGenerated = {
        type: "boolean",
        label: "Is AI Generated",
        description: "If true, the content is AI-generated",
      };
      props.tiktokTitle = {
        type: "string",
        label: "Title",
        description: "Title for image posts. Must be less than 90 characters. Has no effect on video posts. Defaults to the first 90 characters of the post text.",
        optional: true,
      };
      props.tiktokAutoAddMusic = {
        type: "boolean",
        label: "Auto Add Music",
        description: "If true, automatically add recommended music to photo posts. Has no effect on video posts.",
        optional: true,
        default: false,
      };
      props.tiktokIsDraft = {
        type: "boolean",
        label: "Is Draft",
        description: "If true, post as a draft",
        optional: true,
      };
      props.tiktokImageCoverIndex = {
        type: "string",
        label: "Image Cover Index",
        description: "Index of the image (starts from 0) to use as the cover for carousel posts. Only applicable for TikTok slideshows.",
        optional: true,
      };
      props.tiktokVideoCoverTimestamp = {
        type: "string",
        label: "Video Cover Timestamp",
        description: "Location in milliseconds of the video to use as the cover image. Only applicable for videos. If not provided, the frame at 0 milliseconds will be used.",
        optional: true,
      };
      break;
    case "pinterest":
      props.pinterestBoardId = {
        type: "string",
        label: "Board ID",
        description: "Pinterest board ID. To get your board ID, go to the Remix screen, create a draft Pinterest post, and click 'Publish'.",
      };
      props.pinterestTitle = {
        type: "string",
        label: "Pin Title",
        description: "Pin title",
        optional: true,
      };
      props.pinterestAltText = {
        type: "string",
        label: "Pin Alt Text",
        description: "Pin alternative text",
        optional: true,
      };
      props.pinterestLink = {
        type: "string",
        label: "Pin Link",
        description: "Pin URL link",
        optional: true,
      };
      break;
    case "threads":
      props.threadsReplyControl = {
        type: "string",
        label: "Reply Control",
        description: "Who can reply",
        options: [
          "everyone",
          "accounts_you_follow",
          "mentioned_only",
        ],
        optional: true,
      };
      break;
    case "youtube":
      props.youtubeTitle = {
        type: "string",
        label: "Video Title",
        description: "Video title",
      };
      props.youtubePrivacyStatus = {
        type: "string",
        label: "Privacy Status",
        description: "Video privacy status",
        options: [
          "private",
          "public",
          "unlisted",
        ],
      };
      props.youtubeShouldNotifySubscribers = {
        type: "boolean",
        label: "Notify Subscribers",
        description: "If true, subscribers will be notified",
      };
      props.youtubeIsMadeForKids = {
        type: "boolean",
        label: "Is Made For Kids",
        description: "If true, marks the video as made for kids",
        optional: true,
        default: false,
      };
      props.youtubeContainsSyntheticMedia = {
        type: "boolean",
        label: "Contains Synthetic Media",
        description: "If true, the media contains synthetic content, such as AI images, AI videos, or AI avatars",
        optional: true,
      };
      break;
    }

    return props;
  },
  async run({ $ }) {
    const {
      accountId,
      text,
      mediaUrls,
      targetType,
      additionalPosts,
      scheduledTime,
    } = this;

    // Set platform based on targetType - "webhook" becomes "other", all others use targetType value
    const platform = targetType === "webhook"
      ? "other"
      : targetType;

    // Build content object
    const content = {
      text,
      mediaUrls,
      platform,
    };

    // Parse and add additional posts if provided
    if (additionalPosts) {
      try {
        content.additionalPosts = typeof additionalPosts === "string"
          ? JSON.parse(additionalPosts)
          : additionalPosts;
      } catch (error) {
        throw new Error("Invalid JSON format in Additional Posts");
      }
    }

    // Build target object based on targetType - axios will automatically exclude undefined values
    const target = {
      targetType,
    };

    switch (targetType) {
    case "webhook":
      target.url = this.webhookUrl;
      break;
    case "linkedin":
      target.pageId = this.linkedinPageId;
      break;
    case "facebook":
      target.pageId = this.facebookPageId;
      target.mediaType = this.facebookMediaType;
      break;
    case "instagram":
      target.mediaType = this.instagramMediaType;
      target.altText = this.instagramAltText;
      break;
    case "tiktok":
      target.privacyLevel = this.tiktokPrivacyLevel;
      target.disabledComments = this.tiktokDisabledComments;
      target.disabledDuet = this.tiktokDisabledDuet;
      target.disabledStitch = this.tiktokDisabledStitch;
      target.isBrandedContent = this.tiktokIsBrandedContent;
      target.isYourBrand = this.tiktokIsYourBrand;
      target.isAiGenerated = this.tiktokIsAiGenerated;
      target.title = this.tiktokTitle;
      target.autoAddMusic = this.tiktokAutoAddMusic;
      target.isDraft = this.tiktokIsDraft;
      target.imageCoverIndex = this.tiktokImageCoverIndex
        ? parseInt(this.tiktokImageCoverIndex)
        : undefined;
      target.videoCoverTimestamp = this.tiktokVideoCoverTimestamp
        ? parseInt(this.tiktokVideoCoverTimestamp)
        : undefined;
      break;
    case "pinterest":
      target.boardId = this.pinterestBoardId;
      target.title = this.pinterestTitle;
      target.altText = this.pinterestAltText;
      target.link = this.pinterestLink;
      break;
    case "threads":
      target.replyControl = this.threadsReplyControl;
      break;
    case "youtube":
      target.title = this.youtubeTitle;
      target.privacyStatus = this.youtubePrivacyStatus;
      target.shouldNotifySubscribers = this.youtubeShouldNotifySubscribers;
      target.isMadeForKids = this.youtubeIsMadeForKids;
      target.containsSyntheticMedia = this.youtubeContainsSyntheticMedia;
      break;
    }

    // Build the request body - axios will automatically exclude undefined values
    const data = {
      post: {
        accountId,
        content,
        target,
      },
      scheduledTime,
    };

    const response = await this.blotato._makeRequest({
      $,
      method: "POST",
      path: "/v2/posts",
      data,
    });

    $.export("$summary", `Successfully submitted post. Post Submission ID: ${response.postSubmissionId}`);

    return response;
  },
};
