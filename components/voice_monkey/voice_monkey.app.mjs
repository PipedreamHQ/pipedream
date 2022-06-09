import { axios } from "@pipedream/platform";
import common from "./common/constants.mjs";
import { objectFilterNull } from "./utils/functions.mjs";

export default {
  type: "app",
  app: "voice_monkey",
  propDefinitions: {
    monkey: {
      type: "string",
      label: "Monkey",
      description: "This is the ID of the Monkey you want to trigger. Sign in and visit ‘Manage Monkeys’ to create a monkey and view its ID",
    },
    announcement: {
      type: "string",
      label: "Announcement text",
      description: "If you want your Alexa device to speak something out loud when you trigger your monkey then add the text to this parameter. You must open the Voice Monkey Skill as the last step of your routine.",
    },
    chime: {
      type: "string",
      label: "Chime",
      description: "Add a notification/alarm sound to your routine.",
      options: common.CHIMES,
      optional: true,
    },
    voice: {
      type: "string",
      label: "Voice",
      description: "Select from one of the many different voices available for your announcement. Alexa (default)",
      options: common.VOICES,
      optional: true,
    },
    audioFileUrl: {
      type: "string",
      label: "Audio File URL",
      description: "Play an audio file on your Alexa device. Include the full URL including https://",
      optional: true,
    },
    backgroundAudioFileUrl: {
      type: "string",
      label: "Background Audio File URL",
      description: "Play an audio file in the background wishlist Alexa makes your announcement. Include the full URL including https://",
      optional: true,
    },
    promptYesResponsePreset: {
      type: "string",
      label: "Prompt 'Yes' Response Preset Id",
      description: "With prompts you can ask Alexa to ask you a yes/no question (that you include in the announcement of this request) e.g. \"Sall I turn on the lights?\". If you reply \"Yes\", the Preset Id you specify here will be triggered.",
      optional: true,
    },
    promptNoResponsePreset: {
      type: "string",
      label: "Prompt 'No' Response Preset Id",
      description: "With prompts you can ask Alexa to ask you a yes/no question (that you include in the announcement of this request) e.g. \"Sall I turn on the lights?\". If you reply \"No\", the Preset Id you specify here will be triggered.",
      optional: true,
    },
    imageUrl: {
      type: "string",
      label: "Image URL (https://)",
      description: "Send an image hosted on a publicly accessible https URL to a screen enabled Alexa device such as an Echo Show. As with announcements, the Alexa routine must open the Voice Monkey Skill as its final action.",
      optional: true,
    },
    videoUrl: {
      type: "string",
      label: "Video URL (https://)",
      description: "You can send a video to alexa devices with a screen including the Echo Show. The ‘announcement’ parameter must not be blank. You must open the Voice Monkey Skill as the last step of your routine.",
      optional: true,
    },
    websiteUrl: {
      type: "string",
      label: "Website URL",
      description: "Open a website on your screen enabled Alexa device. Include the full URL including https://",
      optional: true,
    },
  },
  methods: {
    _getParams(params) {
      return {
        access_token: `${this.$auth.access_token}`,
        secret_token: `${this.$auth.secret_token}`,
        ...objectFilterNull(params),
      };
    },
    async _makeRequest({
      $,
      params,
      ...otherConfig
    }) {
      const config = {
        url: `${common.BASE_URL}`,
        params: this._getParams(params),
        ...otherConfig,
      };

      return axios($ || this, config);
    },
    async sendTrigger({
      $, params,
    }) {
      return await this._makeRequest({
        $,
        method: "POST",
        params,
      });
    },
  },
};
