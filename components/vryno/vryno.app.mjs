import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vryno",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Name of the lead.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the lead.",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the lead.",
    },
    source: {
      type: "string",
      label: "Source",
      description: "Source from which the lead was obtained.",
    },
    interest: {
      type: "string",
      label: "Interest",
      description: "Specific product or service the lead is interested in.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.vryno.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async createLead({
      name, email, phoneNumber, source, interest,
    }) {
      const input = {
        name,
        email,
        "contact details": {
          phone: phoneNumber,
          source,
        },
      };
      if (interest) {
        input.interest = interest;
      }
      return this._makeRequest({
        method: "POST",
        path: "/createLead",
        data: {
          input,
        },
      });
    },
    async checkLeadDuplicate({
      email, phoneNumber,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/checkDuplicate?email=${email}&phone=${phoneNumber}`,
      });
    },
  },
};
