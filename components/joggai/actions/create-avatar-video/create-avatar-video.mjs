import {
  ASPECT_VIDEO_RATIO_OPTIONS,
  AVATAR_TYPE_OPTIONS,
  SCREEN_STYLE_OPTIONS,
  VOICE_TYPE_OPTIONS,
} from "../../common/constants.mjs";
import { checkResponse } from "../../common/utils.mjs";
import joggai from "../../joggai.app.mjs";

export default {
  key: "joggai-create-avatar-video",
  name: "Create Avatar Video",
  description: "Creates an avatar video using JoggAI API. [See the documentation](https://docs.jogg.ai/api-reference/Create-Avatar-Videos/CreateAvatarVideo)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    joggai,
    screenStyle: {
      type: "integer",
      label: "Screen Style",
      description: "Style of the screen.",
      options: SCREEN_STYLE_OPTIONS,
    },
    avatarType: {
      type: "string",
      label: "Avatar Type",
      description: "Source type of the avatar.",
      options: AVATAR_TYPE_OPTIONS,
    },
    avatarId: {
      propDefinition: [
        joggai,
        "avatarId",
        ({ avatarType }) => ({
          avatarType,
        }),
      ],
    },
    voiceType: {
      type: "string",
      label: "Voice Type",
      description: "Source type of the voice.",
      options: VOICE_TYPE_OPTIONS,
    },
    voiceId: {
      propDefinition: [
        joggai,
        "voiceId",
        ({ voiceType }) => ({
          voiceType,
        }),
      ],
    },
    script: {
      type: "string",
      label: "Script",
      description: "Script content for the avatar to speak. Must provide either script or `Audio URL`.",
      optional: true,
    },
    audioUrl: {
      type: "string",
      label: "Audio URL",
      description: "Url for Audio, either script or audio_url must be provided, but not both.",
      optional: true,
    },
    aspectRatio: {
      type: "string",
      label: "Aspect Ratio",
      description: "Aspect ratio of the output video.",
      options: ASPECT_VIDEO_RATIO_OPTIONS,
    },
    caption: {
      type: "boolean",
      label: "Caption",
      description: "Whether to add caption to the video.",
      optional: true,
    },
    videoName: {
      type: "string",
      label: "Video Name",
      description: "If you want to specify the name of the generated video, please use this parameter.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.script && !this.audioUrl) {
      throw new Error("You must provide at least one of `Script` or `Audio URL`.");
    }
    if (this.script && this.audioUrl) {
      throw new Error("You must provide either `Script` or `Audio URL`, but not both.");
    }

    const response = await this.joggai.createAvatarVideo({
      $,
      data: {
        screen_style: this.screenStyle,
        avatar_type: this.avatarType && parseInt(this.avatarType),
        avatar_id: this.avatarId,
        voice_id: this.voiceId,
        script: this.script,
        audio_url: this.audioUrl,
        aspect_ratio: this.aspectRatio && parseInt(this.aspectRatio),
        caption: this.caption,
        video_name: this.videoName,
      },
    });

    checkResponse(response);

    $.export("$summary", "Avatar video created successfully");
    return response;
  },
};
