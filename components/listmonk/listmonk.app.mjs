import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "listmonk",
  propDefinitions: {
    listIds: {
      type: "string[]",
      label: "Lists",
      description: "Array of list IDs to subscribe to (marked as unconfirmed by default).",
      async options({ page }) {
        const { data: { results } } = await this.listLists({
          params: {
            page: page + 1,
          },
        });
        return results?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    templateId: {
      type: "string",
      label: "Template",
      description: "ID of the template to use. If left empty, the default template is used.",
      optional: true,
      async options() {
        const { data } = await this.listTemplates();
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.url}/api`;
    },
    _getAuth() {
      return {
        username: `${this.$auth.username}`,
        password: `${this.$auth.password}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._getAuth(),
        ...args,
      });
    },
    listSubscribers(args = {}) {
      return this._makeRequest({
        path: "/subscribers",
        ...args,
      });
    },
    listLists(args = {}) {
      return this._makeRequest({
        path: "/lists",
        ...args,
      });
    },
    listTemplates(args = {}) {
      return this._makeRequest({
        path: "/templates",
        ...args,
      });
    },
    createSubscriber(args = {}) {
      return this._makeRequest({
        path: "/subscribers",
        method: "POST",
        ...args,
      });
    },
    createList(args = {}) {
      return this._makeRequest({
        path: "/lists",
        method: "POST",
        ...args,
      });
    },
    createCampaign(args = {}) {
      return this._makeRequest({
        path: "/campaigns",
        method: "POST",
        ...args,
      });
    },
  },
};
