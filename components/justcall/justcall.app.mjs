import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "justcall",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "Campaign ID in which you wish to add this contact.",
      async options({ page }) {
        const { data } = await this.listCampaigns({
          params: {
            page: page + 1,
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
    from: {
      type: "string",
      label: "From",
      description: "JustCall SMS capabled number in E.164 format - ex +14155552671.",
      async options() {
        const { data } = await this.listSMSPhoneNumbers({
          params: {
            sms: 1,
          },
        });

        return data.map(({ phone }) => (phone));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.justcall.io/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `${this.$auth.api_key}:${this.$auth.api_secret}`,
        "Accept": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "autodialer/campaigns/add",
        ...args,
      });
    },
    createHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "webhooks/add",
        ...args,
      });
    },
    deleteHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "webhooks/delete",
        ...args,
      });
    },
    listCampaigns(args = {}) {
      return this._makeRequest({
        path: "autodialer/campaigns/list",
        ...args,
      });
    },
    listSMSPhoneNumbers(args = {}) {
      return this._makeRequest({
        path: "numbers/list",
        ...args,
      });
    },
    sendTextMessage(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "texts/new",
        ...args,
      });
    },
  },
};
