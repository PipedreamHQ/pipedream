import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rafflys",
  propDefinitions: {
    promotionId: {
      type: "string",
      label: "Promotion ID",
      description: "The ID of the promotion to monitor.",
      async options() {
        const { data } = await this.listPromotions();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app-sorteos.com/api/v2";
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-KEY": this.$auth.api_key,
        },
      });
    },
    listPromotions(args = {}) {
      return this._makeRequest({
        path: "/promotions",
        ...args,
      });
    },
  },
};
