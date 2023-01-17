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
    createSimpleCard({
      $ = this,
      data,
    }) {
      return axios($, {
        url: this._getBaseUrl("/v1/cards/simple"),
        data,
        headers: this._getHeaders(),
        method: "POST",
      });
    },
  },
};
