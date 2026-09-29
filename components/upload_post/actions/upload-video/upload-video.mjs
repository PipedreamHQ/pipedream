import common from "../../common/upload-common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "upload_post-upload-video",
  name: "Upload Video",
  description: "Publish a video from a public URL to one or more social networks (TikTok, Instagram, YouTube, LinkedIn, Facebook, X, Threads, Pinterest, Bluesky and more). [See the documentation](https://docs.upload-post.com/api/upload-video)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    platforms: {
      propDefinition: [
        common.props.app,
        "platforms",
        (c) => ({
          user: c.user,
          supportedPlatforms: constants.VIDEO_PLATFORMS,
        }),
      ],
    },
    video: {
      type: "string",
      label: "Video URL",
      description: "Public, direct URL of the video file to publish (e.g. `https://example.com/video.mp4`). Google Drive links must be shared with \"Anyone with the link\".",
    },
    title: {
      propDefinition: [
        common.props.app,
        "title",
      ],
      description: "Default title/caption of the video. **Required** for YouTube; optional for the other platforms.",
      optional: true,
    },
    description: {
      propDefinition: [
        common.props.app,
        "description",
      ],
    },
    scheduledDate: {
      propDefinition: [
        common.props.app,
        "scheduledDate",
      ],
    },
    timezone: {
      propDefinition: [
        common.props.app,
        "timezone",
      ],
    },
    addToQueue: {
      propDefinition: [
        common.props.app,
        "addToQueue",
      ],
    },
    asyncUpload: {
      propDefinition: [
        common.props.app,
        "asyncUpload",
      ],
    },
    firstComment: {
      propDefinition: [
        common.props.app,
        "firstComment",
      ],
    },
    externalId: {
      propDefinition: [
        common.props.app,
        "externalId",
      ],
    },
    privacyLevel: {
      type: "string",
      label: "TikTok Privacy Level",
      description: "TikTok privacy setting. TikTok decides per account which levels are available. Omit to keep the account's default.",
      options: constants.TIKTOK_PRIVACY_LEVELS,
      optional: true,
    },
    mediaType: {
      type: "string",
      label: "Instagram Media Type",
      description: "Type of Instagram video media. Defaults to `REELS`.",
      options: [
        "REELS",
        "STORIES",
      ],
      optional: true,
    },
    facebookMediaType: {
      type: "string",
      label: "Facebook Media Type",
      description: "`REELS` (short-form 9:16), `STORIES` (24h ephemeral) or `VIDEO` (normal Page video). Defaults to `REELS`.",
      options: [
        "REELS",
        "STORIES",
        "VIDEO",
      ],
      optional: true,
    },
    privacyStatus: {
      type: "string",
      label: "YouTube Privacy Status",
      description: "YouTube privacy setting. Defaults to `public`.",
      options: constants.YOUTUBE_PRIVACY_STATUS,
      optional: true,
    },
    visibility: {
      type: "string",
      label: "LinkedIn Visibility",
      description: "LinkedIn visibility setting. Defaults to `PUBLIC`.",
      options: constants.LINKEDIN_VISIBILITY,
      optional: true,
    },
    facebookPageId: {
      propDefinition: [
        common.props.app,
        "facebookPageId",
        (c) => ({
          user: c.user,
        }),
      ],
    },
    targetLinkedinPageId: {
      propDefinition: [
        common.props.app,
        "targetLinkedinPageId",
        (c) => ({
          user: c.user,
        }),
      ],
    },
    pinterestBoardId: {
      propDefinition: [
        common.props.app,
        "pinterestBoardId",
        (c) => ({
          user: c.user,
        }),
      ],
    },
    additionalFields: {
      propDefinition: [
        common.props.app,
        "additionalFields",
      ],
      description: "Any other parameter documented for [Upload Video](https://docs.upload-post.com/api/upload-video), as `field: value` pairs (e.g. `tiktok_title`, `youtube_description`, `tags` (JSON array), `share_to_feed`, `cover_url`, `x_first_comment`).",
    },
  },
  async run({ $ }) {
    if (this.platforms?.includes("youtube") && !this.title) {
      throw new Error("**Title** is required when publishing to YouTube");
    }
    const response = await this.app.uploadVideo({
      $,
      fields: this.buildFields({
        "video": this.video,
        "privacy_level": this.privacyLevel,
        "media_type": this.mediaType,
        "facebook_media_type": this.facebookMediaType,
        "privacyStatus": this.privacyStatus,
        "visibility": this.visibility,
        "facebook_page_id": this.facebookPageId,
        "target_linkedin_page_id": this.targetLinkedinPageId,
        "pinterest_board_id": this.pinterestBoardId,
      }),
    });
    $.export("$summary", this.getSummary(response));
    return response;
  },
};
