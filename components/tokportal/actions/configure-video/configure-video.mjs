import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import tokportal from "../../tokportal.app.mjs";

export default {
  key: "tokportal-configure-video",
  name: "Configure Video",
  description: "Configure one video slot (video, carousel or story) of a bundle by its 1-based position: media URL, caption, publish date and platform options."
    + " Use **Create Bundle** with a `videos_quantity` first; upload media with **Upload Image From URL** or pass a public direct `.mp4` URL."
    + " Set **Auto Publish** or call **Publish All Bundle Videos** afterwards so the manager can post it."
    + " [See the documentation](https://developers.tokportal.com/configure-videos/)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    tokportal,
    bundleId: {
      propDefinition: [
        tokportal,
        "bundleId",
      ],
    },
    position: {
      propDefinition: [
        tokportal,
        "position",
      ],
    },
    videoType: {
      type: "string",
      label: "Video Type",
      description: "`video` (needs **Video URL** and **Description**), `carousel` (needs **Carousel Images** and **Description**) or `story` (exactly one of **Video URL** or **Story Image URL**).",
      options: constants.VIDEO_TYPE_OPTIONS,
    },
    targetPublishDate: {
      type: "string",
      label: "Target Publish Date",
      description: "First day of a 2-day publishing window in `YYYY-MM-DD` format: the manager may post on this day or the next."
        + " The end day is derived (this day + 1) and cannot be set here. Max 3 videos per day per bundle."
        + " Minimum lead time: 3 days ahead while the account is still being created, 1 day for an existing or delivered account.",
    },
    videoUrl: {
      type: "string",
      label: "Video URL",
      description: "Public direct video URL (`.mp4`) or TokPortal storage URL. Required for `video`, optional for a video `story`.",
      optional: true,
    },
    carouselImages: {
      type: "string[]",
      label: "Carousel Images",
      description: "1-20 public image URLs or TokPortal storage paths (see **Upload Image From URL**). Required for `carousel`.",
      optional: true,
    },
    carouselTitle: {
      type: "string",
      label: "Carousel Title",
      description: "Optional title of the carousel.",
      optional: true,
    },
    storyImageUrl: {
      type: "string",
      label: "Story Image URL",
      description: "Story image URL. For a `story`, provide exactly one of **Video URL** or **Story Image URL**.",
      optional: true,
    },
    storyRepostUrl: {
      type: "string",
      label: "Story Repost URL",
      description: "Make the story repost an existing post from the same platform (+1 credit).",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Caption of the post. Required for `video` and `carousel`, ignored for stories.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Internal name of the slot.",
      optional: true,
    },
    externalRef: {
      propDefinition: [
        tokportal,
        "externalRef",
      ],
      optional: true,
    },
    autoPublish: {
      type: "boolean",
      label: "Auto Publish",
      description: "Whether to publish the slot immediately after configuration (the bundle must be accepted by a manager).",
      optional: true,
    },
    editingInstructions: {
      type: "string",
      label: "Editing Instructions",
      description: "Instructions for the manager when the bundle includes edit slots.",
      optional: true,
    },
    aiContentDisclaimer: {
      type: "boolean",
      label: "AI Content Disclaimer",
      description: "Whether the manager enables the platform AI-generated content label (free).",
      optional: true,
    },
    discloseAsAds: {
      type: "boolean",
      label: "Disclose As Ads",
      description: "Whether the manager enables paid-partnership disclosure or adds #ad (free).",
      optional: true,
    },
    instantRepostAsStory: {
      type: "boolean",
      label: "Instant Repost As Story",
      description: "Whether the manager reposts the video as a story right after posting (+1 credit).",
      optional: true,
    },
    tiktokSoundUrl: {
      type: "string",
      label: "TikTok Sound URL",
      description: "TikTok sound to add to the post.",
      optional: true,
    },
    volumeOriginalSound: {
      type: "integer",
      label: "Volume Original Sound",
      description: "Volume of the original sound (0-100).",
      min: 0,
      max: 100,
      optional: true,
    },
    volumeAddedSound: {
      type: "integer",
      label: "Volume Added Sound",
      description: "Volume of the added sound (0-100).",
      min: 0,
      max: 100,
      optional: true,
    },
    instagramContentType: {
      type: "string",
      label: "Instagram Content Type",
      description: "`reel` or `post` (Instagram only).",
      options: constants.INSTAGRAM_CONTENT_TYPE_OPTIONS,
      optional: true,
    },
    instagramLocation: {
      type: "string",
      label: "Instagram Location",
      description: "Location tag (Instagram only).",
      optional: true,
    },
    instagramCollaborators: {
      type: "string[]",
      label: "Instagram Collaborators",
      description: "Instagram usernames to invite as collaborators, e.g. `[\"brandname\"]`.",
      optional: true,
    },
    instagramAudioName: {
      type: "string",
      label: "Instagram Audio Name",
      description: "Name of the audio to use (Instagram only).",
      optional: true,
    },
    instagramAddToStory: {
      type: "boolean",
      label: "Instagram Add To Story",
      description: "Whether to also share the post to the story (Instagram only).",
      optional: true,
    },
    youtubeTitle: {
      type: "string",
      label: "YouTube Title",
      description: "Title of the YouTube video (YouTube only).",
      optional: true,
    },
    youtubeTags: {
      type: "string[]",
      label: "YouTube Tags",
      description: "Tags of the YouTube video (YouTube only).",
      optional: true,
    },
    youtubeCategory: {
      type: "string",
      label: "YouTube Category",
      description: "YouTube category (YouTube only).",
      optional: true,
    },
    youtubeVisibility: {
      type: "string",
      label: "YouTube Visibility",
      description: "`public`, `unlisted` or `private` (YouTube only).",
      options: constants.YOUTUBE_VISIBILITY_OPTIONS,
      optional: true,
    },
    youtubeSoundUrl: {
      type: "string",
      label: "YouTube Sound URL",
      description: "Sound to add to the YouTube video (YouTube only).",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.videoType === "video" && !this.videoUrl) {
      throw new ConfigurationError("Video URL is required when Video Type is `video`.");
    }
    if (this.videoType === "carousel" && !this.carouselImages?.length) {
      throw new ConfigurationError("Carousel Images are required when Video Type is `carousel`.");
    }
    if (this.videoType === "story" && !this.videoUrl && !this.storyImageUrl) {
      throw new ConfigurationError("Provide Video URL or Story Image URL when Video Type is `story`.");
    }

    const response = await this.tokportal.configureVideo({
      $,
      bundleId: this.bundleId,
      position: this.position,
      data: {
        video_type: this.videoType,
        target_publish_date: this.targetPublishDate,
        video_url: this.videoUrl,
        carousel_images: this.carouselImages,
        carousel_title: this.carouselTitle,
        story_image_url: this.storyImageUrl,
        story_repost_url: this.storyRepostUrl,
        description: this.description,
        name: this.name,
        external_ref: this.externalRef,
        auto_publish: this.autoPublish,
        editing_instructions: this.editingInstructions,
        ai_content_disclaimer: this.aiContentDisclaimer,
        disclose_as_ads: this.discloseAsAds,
        instant_repost_as_story: this.instantRepostAsStory,
        tiktok_sound_url: this.tiktokSoundUrl,
        volume_original_sound: this.volumeOriginalSound,
        volume_added_sound: this.volumeAddedSound,
        instagram_content_type: this.instagramContentType,
        instagram_location: this.instagramLocation,
        instagram_collaborators: this.instagramCollaborators,
        instagram_audio_name: this.instagramAudioName,
        instagram_add_to_story: this.instagramAddToStory,
        youtube_title: this.youtubeTitle,
        youtube_tags: this.youtubeTags,
        youtube_category: this.youtubeCategory,
        youtube_visibility: this.youtubeVisibility,
        youtube_sound_url: this.youtubeSoundUrl,
      },
    });

    $.export("$summary", `Configured video slot ${this.position} of bundle ${this.bundleId}`);
    return response?.data ?? response;
  },
};
