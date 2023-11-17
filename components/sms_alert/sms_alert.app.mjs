import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sms_alert",
  propDefinitions: {
    groupName: {
      type: "string",
      label: "Group Name",
      description: "The group in which you want to create the contact.",
      async options({ prevContext }) {
        const { page } = prevContext || {
          page: 1,
        };
        const response = await this.listGroups({
          page,
        });
        return response?.description?.map?.(({ Group: { name } }) => name);
      },
    },
    mobileNumber: {
      type: "string[]",
      label: "Mobile Number(s)",
      description: "The mobile number(s) to which the SMS is to be sent, with or without country code.",
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "The name of the contact.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.smsalert.co.in/api";
    },
    async _makeRequest({
      $ = this,
      path,
      params,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        params: {
          ...params,
          apikey: this.$auth.api_key,
        },
        url: this._baseUrl() + path,
      });
    },
    async listGroups({ page }) {
      return this._makeRequest({
        path: "/grouplist.json",
        params: {
          page,
        },
      });
    },
    async createContact(args) {
      return this._makeRequest({
        method: "POST",
        path: "/createcontact.json",
        ...args,
      });
    },
  },
};
