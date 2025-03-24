import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "xverify",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain you have configured in your Xverify settings under which this query should be processed. See below.",
      options() {
        return [
          this.$auth.domain,
        ];
      },
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to be validated (and optionally corrected).",
    },
    aff: {
      type: "string",
      label: "Affiliate ID",
      description: "The ID you define to identify the affiliate or source of the email for reporting or potential blocking.",
      optional: true,
    },
    subaff: {
      type: "string",
      label: "Sub-Affiliate ID",
      description: "The sub-identifier you define for the affiliate or source of the email for reporting or potential blocking.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to be verified.",
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.xverify.com/v2${path}`;
    },
    getParams(params) {
      return {
        ...params,
        api_key: this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, params, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        params: this.getParams(params),
      });
    },
  },
};
