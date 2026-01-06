import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "opinion_stage",
  propDefinitions: {
    itemId: {
      type: "string",
      label: "Item ID",
      description: "The ID of the item (form, survey, etc.)",
      async options({ page }) {
        const { data } = await this.listItems({
          params: {
            "page[number]": page + 1,
          },
        });
        return data?.map(({
          id: value, attributes: { title: label },
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.opinionstage.com/api/v2";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "accept": "application/vnd.api+json",
        },
        auth: {
          username: `${this.$auth.api_key}`,
          password: "",
        },
        ...opts,
      });
    },
    listItems(opts = {}) {
      return this._makeRequest({
        path: "/items",
        ...opts,
      });
    },
    listResponses({
      itemId, ...opts
    }) {
      return this._makeRequest({
        path: `/items/${itemId}/responses`,
        ...opts,
      });
    },
  },
};
