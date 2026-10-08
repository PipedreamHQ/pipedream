import { ConfigurationError } from "@pipedream/platform";
import common from "../../common/upload-common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "upload_post-upload-video",
  name: "Upload Video",
  description: "Publish a video from a public URL to one or more social networks (TikTok, Instagram, YouTube, LinkedIn, Facebook, X, Threads, Pinterest, Bluesky and more), now, at a scheduled date or in the profile's queue."
    + " Use **List Profiles** to find the profile, **List Facebook Pages** / **List Pinterest Boards** / **List LinkedIn Pages** for page and board IDs."
    + " Returns a `request_id` (follow it with **Get Upload Status**) or, when scheduled, a `job_id`."
    + " YouTube requires a `title`. [See the documentation](https://docs.upload-post.com/api/upload-video)",
  version: "0.0.1",
  ai: "optimized",
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
      description: "Public, direct URL of the video file to publish, e.g. `https://example.com/video.mp4`. Google Drive links must be shared with \"Anyone with the link\".",
    },
    title: {
      propDefinition: [
        common.props.app,
        "title",
      ],
      description: "Default title/caption of the video, e.g. `Behind the scenes`. Required for YouTube; optional for the other platforms. Platform-specific titles passed in `additionalFields` (e.g. `tiktok_title`) override it.",
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
      propDefinition: [
        common.props.app,
        "privacyLevel",
      ],
      description: "TikTok privacy setting, e.g. `PUBLIC_TO_EVERYONE`. TikTok decides per account which levels are available. Omit to keep the account's default.",
    },
    mediaType: {
      propDefinition: [
        common.props.app,
        "mediaType",
      ],
      description: "Type of Instagram video media, e.g. `STORIES`. Defaults to `REELS`.",
      options: [
        "REELS",
        "STORIES",
      ],
    },
    facebookMediaType: {
      propDefinition: [
        common.props.app,
        "facebookMediaType",
      ],
      description: "Type of Facebook video, e.g. `VIDEO`: `REELS` (short-form 9:16), `STORIES` (24h ephemeral) or `VIDEO` (normal Page video). Defaults to `REELS`.",
      options: [
        "REELS",
        "STORIES",
        "VIDEO",
      ],
    },
    privacyStatus: {
      type: "string",
      label: "YouTube Privacy Status",
      description: "YouTube privacy setting, e.g. `unlisted`. Defaults to `public`.",
      options: constants.YOUTUBE_PRIVACY_STATUS,
      optional: true,
    },
    visibility: {
      propDefinition: [
        common.props.app,
        "visibility",
      ],
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
      description: "Any other parameter documented for [Upload Video](https://docs.upload-post.com/api/upload-video) as `field: value` pairs, e.g. `{\"tiktok_title\": \"Short title\", \"youtube_description\": \"Full text\", \"tags\": [\"news\", \"ai\"], \"cover_url\": \"https://example.com/cover.jpg\"}`. Array parameters take a JSON array.",
    },
  },
  async run({ $ }) {
    if (this.platforms?.includes("youtube") && !this.title) {
      throw new ConfigurationError("`title` is required when publishing to YouTube");
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
