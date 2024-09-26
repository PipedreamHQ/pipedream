import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smsapi",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Recipient's mobile phone number",
      async options({ page }) {
        const limit = 20;
        const params = {
          limit,
          offset: limit * page,
        };
        const { collection } = await this.listContacts({
          params,
        });
        return collection?.map(({ phone_number }) => phone_number ) || [];
      },
    },
    senderName: {
      type: "string",
      label: "Sender Name",
      description: "Name of the sender",
      async options() {
        const { collection } = await this.listSenderNames();
        return collection?.map(({ sender }) => sender ) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.smsapi.com";
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
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    listSenderNames(args = {}) {
      return this._makeRequest({
        path: "/sms/sendernames",
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        ...args,
      });
    },
    sendMessage(args = {}) {
      return this._makeRequest({
        path: "/sms.do",
        method: "POST",
        ...args,
      });
    },
  },
};
