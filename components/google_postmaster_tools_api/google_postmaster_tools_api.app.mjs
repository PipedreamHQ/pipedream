import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_postmaster_tools_api",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "Select a domain",
      async options() {
        const response = await this.listDomains();
        return response.domains.map((domain) => ({
          label: domain.name,
          value: domain.name,
        }));
      },
    },
    ipReputation: {
      type: "string",
      label: "IP Reputation",
      description: "Filter events by IP reputation",
      options: [
        {
          label: "High",
          value: "HIGH",
        },
        {
          label: "Medium",
          value: "MEDIUM",
        },
        {
          label: "Low",
          value: "LOW",
        },
        {
          label: "Bad",
          value: "BAD",
        },
      ],
      optional: true,
    },
    domainReputation: {
      type: "string",
      label: "Domain Reputation",
      description: "Filter events by domain reputation",
      options: [
        {
          label: "High",
          value: "HIGH",
        },
        {
          label: "Medium",
          value: "MEDIUM",
        },
        {
          label: "Low",
          value: "LOW",
        },
        {
          label: "Bad",
          value: "BAD",
        },
      ],
      optional: true,
    },
    userReportedSpamRatio: {
      type: "number",
      label: "User Reported Spam Ratio Greater Than",
      description: "Filter events where the user reported spam ratio is greater than the specified value",
      optional: true,
      min: 0,
      max: 1,
      step: 0.01,
    },
    spfSuccessRatio: {
      type: "number",
      label: "SPF Success Ratio Less Than",
      description: "Filter events where the SPF success ratio is less than the specified value",
      default: 1,
      optional: true,
      min: 0,
      max: 1,
      step: 0.01,
    },
    dkimSuccessRatio: {
      type: "number",
      label: "DKIM Success Ratio Less Than",
      description: "Filter events where the DKIM success ratio is less than the specified value",
      default: 1,
      optional: true,
      min: 0,
      max: 1,
      step: 0.01,
    },
    dmarcSuccessRatio: {
      type: "number",
      label: "DMARC Success Ratio Less Than",
      description: "Filter events where the DMARC success ratio is less than the specified value",
      default: 1,
      optional: true,
      min: 0,
      max: 1,
      step: 0.01,
    },
    outboundEncryptionRatio: {
      type: "number",
      label: "Outbound Encryption Ratio Less Than",
      description: "Filter events where the outbound encryption ratio is less than the specified value",
      default: 1,
      optional: true,
      min: 0,
      max: 1,
      step: 0.01,
    },
    inboundEncryptionRatio: {
      type: "number",
      label: "Inbound Encryption Ratio Less Than",
      description: "Filter events where the inbound encryption ratio is less than the specified value",
      default: 1,
      optional: true,
      min: 0,
      max: 1,
      step: 0.01,
    },
    deliveryError: {
      type: "string",
      label: "Delivery Error",
      description: "Specify the type of delivery error",
      options: [
        {
          label: "DNS Error",
          value: "DNS_ERROR",
        },
        {
          label: "Mailbox Full",
          value: "MAILBOX_FULL",
        },
        {
          label: "Message Too Large",
          value: "MESSAGE_TOO_LARGE",
        },
        {
          label: "Spam Rejection",
          value: "SPAM_REJECTION",
        },
        {
          label: "Bad Configuration",
          value: "BAD_CONFIGURATION",
        },
        {
          label: "Other",
          value: "OTHER",
        },
      ],
      optional: true,
    },
    errorRatio: {
      type: "number",
      label: "Error Ratio Greater Than",
      description: "Filter events where the error ratio is greater than the specified value",
      optional: true,
      min: 0,
      max: 1,
      step: 0.01,
    },
  },
  methods: {
    _baseUrl() {
      return "https://gmailpostmastertools.googleapis.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listDomains() {
      return this._makeRequest({
        path: "/domains",
      });
    },
    async getDomainTrafficStats({ domainName }) {
      return this._makeRequest({
        path: `/domains/${domainName}/trafficStats`,
      });
    },
  },
};
