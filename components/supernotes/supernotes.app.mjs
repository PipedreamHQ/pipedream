import { axios } from "@pipedream/platform";
import constants from "./actions/common/constants.mjs";

export default {
  type: "app",
  app: "supernotes",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The name of the card",
    },
    markup: {
      type: "string",
      label: "Markup",
      description: "The markup of the card",
    },
    icon: {
      type: "string",
      label: "Icon",
      description: "The icon of the card",
      options: constants.CARD_ICONS_OPTS,
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags of the card",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl(endpoint) {
      return `https://api.supernotes.app${endpoint}`;
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $, config,
    }) {
      config.headers = this._getHeaders();
      config.url = this._getBaseUrl(config.path);
      return axios($ ?? this, config);
    },
  },
};
