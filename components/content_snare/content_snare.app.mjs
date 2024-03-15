import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "content_snare",
  propDefinitions: {
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the client's company.",
      optional: true,
    },
    clientEmail: {
      type: "string",
      label: "Email",
      description: "The email address of the client.",
    },
    clientFullName: {
      type: "string",
      label: "Full Name",
      description: "The full name of the client.",
    },
    clientPhone: {
      type: "string",
      label: "Client Phone",
      description: "The phone number of the client.",
      optional: true,
    },
    requestTemplateId: {
      type: "string",
      label: "Request Template ID",
      description: "The ID of the request template to use for this request.",
      async options({ prevContext }) {
        const { nextOffset } = prevContext;
        if (nextOffset === null) {
          return [];
        }
        const {
          pagination: { offset },
          results,
        } = await this.listRequestTemplates({
          params: {
            limit: constants.DEFAULT_LIMIT,
            offset: nextOffset,
          },
        });
        return {
          options: results.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            nextOffset: results.length < constants.DEFAULT_LIMIT
              ? null
              : offset + results.length,
          },
        };
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      };
      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listRequestTemplates(args = {}) {
      return this._makeRequest({
        path: "/request_templates",
        ...args,
      });
    },
  },
};
