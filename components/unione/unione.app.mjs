import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "unione",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Unique identifier of the template that had been created by [template/set](https://docs.unione.io/en/web-api-ref#template-set) method. If `Template ID` is passed then fields from the template are used instead of missed email/send parameters.",
      async options({ page }) {
        const { templates: data } = await this.listTemplates({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "An array of strings (max 4 unique strings, max 50 characters each). You can use tags to categorize emails by your own criteria.",
      async options({ page }) {
        const { tags: data } = await this.listTags({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          tag_id: value, tag: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getBaseUrl() {
      return `https://${this.$auth.server}/en/transactional/api/v1`;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-KEY": this._getApiKey(),
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._getBaseUrl()}${path}`,
        headers: this._getHeaders(),
        ...args,
      });
    },
    sendEmail(opts = {}) {
      return this._makeRequest({
        path: "/email/send.json",
        method: "POST",
        ...opts,
      });
    },
    listTemplates(opts = { }) {
      return this._makeRequest({
        path: "/template/list.json",
        method: "POST",
        data: {},
        ...opts,
      });
    },
    listTags(opts = { }) {
      return this._makeRequest({
        path: "/tag/list.json",
        method: "POST",
        data: {},
        ...opts,
      });
    },
  },
};
