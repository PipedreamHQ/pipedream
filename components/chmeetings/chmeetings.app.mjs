import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chmeetings",
  propDefinitions: {
    date: {
      type: "string",
      label: "Date",
      description: "Date of the contribution, i.e.: `2025-11-28T17:32:28Z`",
      optional: true,
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "Method used for the contribution such as cash, credit card or bank transfer",
    },
    fundName: {
      type: "string",
      label: "Fund Name",
      description: "Name of the fund that will receive the contribution",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Amount of the contribution",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the person",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the person",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the person",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "Phone number of the person",
      optional: true,
    },
    birthDate: {
      type: "string",
      label: "Birth Date",
      description: "Birth date of the person in YYYY-MM-DD format",
      optional: true,
    },
    church: {
      type: "string",
      label: "Church",
      description: "Church or campus associated with the person",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.chmeetings.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "ApiKey": `${this.$auth.api_key}`,
          ...headers,
        },
      });
    },
    async createContribution(args = {}) {
      return this._makeRequest({
        path: "/contributions",
        method: "post",
        ...args,
      });
    },
    async getContributions(args = {}) {
      return this._makeRequest({
        path: "/contributions",
        ...args,
      });
    },
    async createPerson(args = {}) {
      return this._makeRequest({
        path: "/people",
        method: "post",
        ...args,
      });
    },
  },
};
