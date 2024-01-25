import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "amazon_alexa",
  propDefinitions: {
    skillId: {
      type: "string",
      label: "Skill ID",
      description: "The unique identifier for the Alexa skill",
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "The stage of the skill, such as `development` or `live`",
      options: [
        "development",
        "live",
      ],
    },
    inputContent: {
      type: "string",
      label: "Input Content",
      description: "Utterance text from a user to Alexa.",
    },
    deviceLocale: {
      type: "string",
      label: "Device Locale",
      description: "Locale for the virtual device used in the simulation.",
      default: "en-US",
      options: [
        "en-US",
        "en-GB",
        "en-CA",
        "en-AU",
        "de-DE",
        "fr-FR",
        "en-IN",
        "ja-JP",
      ],
    },
    simulationId: {
      type: "string",
      label: "Simulation ID",
      description: "The identifier for the simulation",
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    async _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const response = await axios($, {
        ...args,
        url: this.getUrl(path),
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.status === "FAILED") {
        throw new Error(`Amazon Alexa Error: ${JSON.stringify(response, null, 2)}`);
      }

      return response;
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
