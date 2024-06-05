import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sms_everyone",
  propDefinitions: {
    crmids: {
      type: "string[]",
      label: "CRM IDs",
      description: "The list ID of a list of mobile numbers that you want to send to. First you must upload the list to SMS Everyone interface and retrieve the list ID from SMS Everyone lists page.",
      async options() {
        const { Groups } = await this.listLists({
          data: {
            Action: "List",
          },
        });

        return Groups.map(({
          CrmId: value, Description: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://smseveryone.com/api";
    },
    _auth() {
      return {
        username: `${this.$auth.username}`,
        password: `${this.$auth.password}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: this._auth(),
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/crm",
        ...opts,
      });
    },
    sendSMS(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/campaign",
        ...opts,
      });
    },
  },
};
