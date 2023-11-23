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
        return response?.description?.map?.(({ Group: { name } }) => name) ?? [];
      },
    },
    senderId: {
      type: "string",
      label: "Sender ID",
      description:
        "The Sender ID assigned to your account. [See the documentation for more details](https://kb.smsalert.co.in/developers-api/#Get-Available-Sender-Id-List).",
      async options({ prevContext }) {
        const { page } = prevContext || {
          page: 1,
        };
        const response = await this.listSenderIds({
          page,
        });
        if (response.status === "error") throw new Error(`API response: "${response.description.desc}"`);
        return response.description?.map?.(({ id }) => ({
          label: id,
          value: id,
        })) ?? [];
      },
    },
    messageText: {
      type: "string",
      label: "Message Text",
      description: "The message to be sent.",
    },
    scheduleTime: {
      type: "string",
      label: "Schedule Time",
      description:
        "The date and time for the schedule (Format: `YYYY-MM-DD HH:MM:SS`).",
      optional: true,
    },
    mobileNumber: {
      type: "string[]",
      label: "Mobile Number(s)",
      description:
        "The mobile number(s) to which the SMS is to be sent, with or without country code.",
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
      $ = this, path, params, ...otherOpts
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
    async listSenderIds({ page }) {
      return this._makeRequest({
        path: "/senderlist.json",
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
    async sendSMS(args) {
      return this._makeRequest({
        method: "POST",
        path: "/push.json",
        ...args,
      });
    },
  },
};
