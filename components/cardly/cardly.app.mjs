import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cardly",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List",
      description: "Identifier of a contact list",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          offset: limit * page,
        };
        const { data } = await this.listContactLists({
          params,
        });
        return data.results?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    templateId: {
      type: "string",
      label: "Template",
      description: "Identifier of a template",
      optional: true,
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          offset: limit * page,
        };
        const { data } = await this.listTemplates({
          params,
        });
        return data.results?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    artId: {
      type: "string",
      label: "Art",
      description: "Identifier of artwork",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          offset: limit * page,
        };
        const { data } = await this.listArt({
          params,
        });
        return data.results?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.card.ly/v2";
    },
    _headers() {
      return {
        "API-Key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listContactLists(args = {}) {
      return this._makeRequest({
        path: "/contact-lists",
        ...args,
      });
    },
    listTemplates(args = {}) {
      return this._makeRequest({
        path: "/templates",
        ...args,
      });
    },
    listArt(args = {}) {
      return this._makeRequest({
        path: "/art",
        ...args,
      });
    },
    createContact({
      listId, ...args
    }) {
      return this._makeRequest({
        path: `/contact-lists/${listId}/contacts`,
        method: "POST",
        ...args,
      });
    },
    generatePreview(args = {}) {
      return this._makeRequest({
        path: "/orders/preview",
        method: "POST",
        ...args,
      });
    },
    placeOrder(args = {}) {
      return this._makeRequest({
        path: "/orders/place",
        method: "POST",
        ...args,
      });
    },
  },
};
