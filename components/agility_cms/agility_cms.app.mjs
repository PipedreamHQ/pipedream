import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "agility_cms",
  propDefinitions: {
    locale: {
      type: "string",
      label: "Locale",
      description: "The locale code you want to retrieve content for (it must already be in `Locales Settings` of your Agility account)",
      options: constants.LOCALE_OPTIONS,
      default: "en-us",
    },
    itemId: {
      type: "string",
      label: "Item ID",
      description: "ID of the item to get details of",
      async options({ locale }) {
        const response = await this.getItems({
          locale,
        });
        const itemsIds = response.items;
        return itemsIds.map(({
          contentID, properties,
        }) => ({
          value: contentID,
          label: properties.referenceName,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/${this.$auth.guid}/${this.$auth.api_type}`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "APIKey": `${this.$auth.api_key}`,
        },
      });
    },
    async getContentModels(args = {}) {
      return this._makeRequest({
        path: "/contentmodels",
        ...args,
      });
    },
    async getItems({
      locale, ...args
    }) {
      return this._makeRequest({
        path: `/${locale}/sync/items`,
        ...args,
      });
    },
    async getItem({
      locale, itemId, ...args
    }) {
      return this._makeRequest({
        path: `/${locale}/item/${itemId}`,
        ...args,
      });
    },
  },
};
