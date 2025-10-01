import voiceMonkey from "../../voice_monkey.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "voice_monkey-trigger-monkey",
  name: "Trigger Monkey",
  description: "This action will make an annoucement on your device using any parameters you set. [See docs here](https://voicemonkey.io/docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    announcement: {
      propDefinition: [
        voiceMonkey,
        "announcement",
      ],
    },
    chime: {
      propDefinition: [
        voiceMonkey,
        "chime",
      ],
    },
    voice: {
      propDefinition: [
        voiceMonkey,
        "voice",
      ],
    },
    audioFileUrl: {
      propDefinition: [
        voiceMonkey,
        "audioFileUrl",
      ],
    },
    backgroundAudioFileUrl: {
      propDefinition: [
        voiceMonkey,
        "backgroundAudioFileUrl",
      ],
    },
    promptYesResponsePreset: {
      propDefinition: [
        voiceMonkey,
        "promptYesResponsePreset",
      ],
    },
    promptNoResponsePreset: {
      propDefinition: [
        voiceMonkey,
        "promptNoResponsePreset",
      ],
    },
    imageUrl: {
      propDefinition: [
        voiceMonkey,
        "imageUrl",
      ],
    },
    videoUrl: {
      propDefinition: [
        voiceMonkey,
        "videoUrl",
      ],
    },
    websiteUrl: {
      propDefinition: [
        voiceMonkey,
        "websiteUrl",
      ],
    },
  },
  methods: {
    getParams() {
      return {
        monkey: this.monkey,
        announcement: this.announcement,
        chime: this.chime,
        voice: this.voice,
        audioFileUrl: this.audioFileUrl,
        backgroundAudioFileUrl: this.backgroundAudioFileUrl,
        promptYesResponsePreset: this.promptYesResponsePreset,
        promptNoResponsePreset: this.promptNoResponsePreset,
        imageUrl: this.imageUrl,
        videoUrl: this.videoUrl,
        websiteUrl: this.websiteUrl,
      };
    },
  },
};
