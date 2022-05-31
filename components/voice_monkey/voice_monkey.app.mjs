import { axios } from "@pipedream/platform";
import common from "./common/constants.mjs";

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
      label: "Announcement",
      description: "If you want your Alexa device to speak something out loud when you trigger your monkey then add the text to this parameter. You must open the Voice Monkey Skill as the last step of your routine.",
    },
    imageUrl: {
      type: "string",
      label: "Image URL (https://)",
      description: "Send an image hosted on a publicly accessible https URL to a screen enabled Alexa device such as an Echo Show. As with announcements, the Alexa routine must open the Voice Monkey Skill as its final action.",
    },
    videoUrl: {
      type: "string",
      label: "Video URL (https://)",
      description: "You can send a video to alexa devices with a screen including the Echo Show. The ‘announcement’ parameter must not be blank. You must open the Voice Monkey Skill as the last step of your routine.",
    },
  },
  methods: {
    _getParams(params) {
      return {
        access_token: `${this.$auth.access_token}`,
        secret_token: `${this.$auth.secret_token}`,
        ...params,
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
