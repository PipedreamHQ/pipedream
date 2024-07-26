import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "_360nrs",
  propDefinitions: {
    message: {
      type: "string",
      label: "Message",
      description: "Text of message. At most, there can be 160 characters. The text must be encoded in UTF-8.",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Mobile phone number(s) to receive message. Must include the prefix (e.g. in Spain `34666666666`).",
      async options() {
        const { data } = await this.listContacts();
        return data.map(({
          email: label, phone: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    from: {
      type: "string",
      label: "From Sender",
      description: "Sender text, this label will consist of 15 numbers or 11 alphanumeric characters.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://dashboard.360nrs.com/api/rest";
    },
    getHeaders(headers) {
      const {
        username,
        api_password: password,
      } = this.$auth;
      const token = Buffer.from(`${username}:${password}`).toString("base64");
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Basic ${token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: `${this._baseUrl()}${path}`,
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
  },
};
