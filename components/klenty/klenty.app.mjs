import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "klenty",
  propDefinitions: {
    cadenceName: {
      type: "string",
      label: "Cadence",
      description: "The Cadence you want to add this Prospect to.",
      async options() {
        const data = await this.listCadences();
        return data.map(({ name }) => (name));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The prospect's email address.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The prospect's first name.",
    },
    prospect: {
      type: "string",
      label: "Prospect",
      description: "The prospect to interact.",
      async options({
        page, listName,
      }) {
        const data = await this.getProspectsByList({
          params: {
            start: (LIMIT * page) + 1,
            limit: LIMIT,
            listName,
          },
        });
        return data.map(({
          id: value, Email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    list: {
      type: "string",
      label: "List",
      description: "The list you want to add the Prospect to.",
      async options() {
        const data = await this.listLists();

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
      return `https://app.klenty.com/apis/v1/user/${this.$auth.username}`;
    },
    _headers() {
      return {
        "x-API-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      };

      return axios($, config);
    },
    listCadences(opts = {}) {
      return this._makeRequest({
        path: "/cadences",
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/lists",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/zapier/hooks",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/delete",
        ...opts,
      });
    },
    addProspectToList(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/prospects",
        ...opts,
      });
    },
    updateProspect({
      prospectEmail, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/prospects/${prospectEmail}`,
        ...opts,
      });
    },
    startCadence(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/startcadence",
        ...opts,
      });
    },
    getProspectsByList(opts = {}) {
      return this._makeRequest({
        path: "/prospects",
        ...opts,
      });
    },
  },
};
