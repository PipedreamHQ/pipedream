import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "seven",
  propDefinitions: {
    subaccounts: {
      type: "string",
      label: "Subaccounts",
      description: "Receive data only for the main account, for all your (sub)accounts or only for specific subaccounts",
      async options() {
        const subaccounts = await this.listSubaccounts();
        const items = subaccounts.map((subaccount) => ({
          label: `${subaccount.username} (${subaccount.company})`,
          value: subaccount.id,
        }));

        return [
          {
            label: "Only Main",
            value: "only_main",
          },
          {
            label: "All",
            value: "all",
          },
          ...items,
        ];
      },
    },
    number: {
      type: "string",
      label: "Number",
      description: "The phone number to look up. (e.g. `49176123456789`)",
    },
    to: {
      type: "string",
      label: "To",
      description: "The destination phone number. Accepts all common formats like `0049171123456789`, `49171123456789`, `+49171123456789`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://gateway.seven.io/api";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
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
    lookupCnam(opts = {}) {
      return this._makeRequest({
        path: "/lookup/cnam",
        ...opts,
      });
    },
    lookupFormat(opts = {}) {
      return this._makeRequest({
        path: "/lookup/format",
        ...opts,
      });
    },
    lookupHlr(opts = {}) {
      return this._makeRequest({
        path: "/lookup/hlr",
        ...opts,
      });
    },
    sendSms(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sms",
        ...opts,
      });
    },
    sendTtsCall(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/voice",
        ...opts,
      });
    },
    listSubaccounts(opts = {}) {
      return this._makeRequest({
        path: "/subaccounts",
        params: {
          action: "read",
        },
        ...opts,
      });
    },
    getAnalytics(opts = {}) {
      return this._makeRequest({
        path: "/analytics",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/hooks",
        ...opts,
      });
    },
    deleteHook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/hooks",
        ...opts,
      });
    },
  },
};
