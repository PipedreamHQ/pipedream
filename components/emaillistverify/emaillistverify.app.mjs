import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "emaillistverify",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Email to be verified",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
    },
    domain: {
      type: "string",
      label: "Email domain",
      description: "The domain to use for generating email addresses, i.e.: `gmail.com`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://apps.emaillistverify.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          ...params,
          secret: `${this.$auth.api_key}`,
        },
      });
    },
    async verifyEmail(args = {}) {
      return this._makeRequest({
        path: "/verifyEmail",
        ...args,
      });
    },
    async findEmail(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/find-contact",
        ...args,
      });
    },
  },
};
