import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gupshup",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use",
      async options({ page }) {
        const { data } = await this.listTemplates({
          params: {
            pageNo: page,
          },
        });
        return data.map(({ id }) => id);
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gupshup.io";
    },
    _appName() {
      return this.$auth.appname;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "apikey": `${this.$auth.apikey}`,
        },
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: `/wa/app/${this._appName()}/template`,
        ...opts,
      });
    },
    sendTemplateMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/wa/app/v1/template/msg",
        ...opts,
      });
    },
    updateSubscription({
      subscriptionId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/wa/app/${this._appName()}/subscription/${subscriptionId}`,
        ...opts,
      });
    },
  },
};
