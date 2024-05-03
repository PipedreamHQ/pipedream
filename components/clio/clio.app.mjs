import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "clio",
  propDefinitions: {
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The unique identifier for a single Contact associated with the Matter. ",
      async options({
        prevContext: { nextParams },
        mapper = ({
          id: value, name: label,
        }) => ({
          value,
          label,
        }),
      }) {
        if (nextParams === null) {
          return [];
        }
        const {
          data,
          meta: { paging },
        } = await this.listContacts({
          params: {
            ...nextParams,
            limit: constants.DEFAULT_LIMIT,
          },
        });
        return {
          options: data.map(mapper),
          context: {
            nextParams: paging?.next?.includes("?")
              ? Object.fromEntries(
                new URLSearchParams(paging.next.split("?")[1]),
              )
              : null,
          },
        };
      },
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the matter or task.",
    },
    closeDate: {
      type: "string",
      label: "Close Date",
      description: "Date the Matter was set to closed. (Expects an ISO-8601 date). Eg. `2021-01-01`",
      optional: true,
    },
    clientReference: {
      type: "string",
      label: "Client Reference",
      description: "Client Reference string for external uses.",
      optional: true,
    },
    matterId: {
      type: "string",
      label: "Matter ID",
      description: "The unique identifier for the matter.",
      async options({
        prevContext: { nextParams },
        mapper = ({
          id: value, display_number: label,
        }) => ({
          value,
          label,
        }),
      }) {
        if (nextParams === null) {
          return [];
        }
        const {
          data,
          meta: { paging },
        } = await this.listMatters({
          params: {
            ...nextParams,
            limit: constants.DEFAULT_LIMIT,
          },
        });
        return {
          options: data.map(mapper),
          context: {
            nextParams: paging?.next?.includes("?")
              ? Object.fromEntries(
                new URLSearchParams(paging.next.split("?")[1]),
              )
              : null,
          },
        };
      },
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Fields to be included in the Webhook request.",
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
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
    patch(args = {}) {
      return this._makeRequest({
        method: "patch",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "delete",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts.json",
        ...args,
      });
    },
    listMatters(args = {}) {
      return this._makeRequest({
        path: "/matters.json",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users.json",
        ...args,
      });
    },
  },
};
