import { axios } from "@pipedream/platform";
import { REPUTATION_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "google_postmaster_tools_api",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain Name",
      description: "Select a domain or provide a custom domain name.",
      async options({ prevContext: { pageToken } }) {
        const response = await this.listDomains({
          params: {
            pageToken,
          },
        });
        const nextPageToken = response?.nextPageToken;
        return {
          context: {
            pageToken: nextPageToken,
          },
          options: response?.domains?.map(({ name }) => name.split("/").pop()) ?? [],
        };
      },
    },
    ipReputation: {
      type: "string[]",
      label: "IP Reputation",
      description: "If specified, events will only be emitted if there is at least one IP address in one of the specified categories",
      options: REPUTATION_OPTIONS,
      optional: true,
    },
    domainReputation: {
      type: "string",
      label: "Domain Reputation",
      description: "If specified, events will only be emitted if the domain reputation matches one of the specified categories",
      options: REPUTATION_OPTIONS,
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
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listDomains(args) {
      return this._makeRequest({
        url: "/domains",
        ...args,
      });
    },
    async getDomainTrafficStats({ domainName }) {
      return this._makeRequest({
        url: `/domains/${domainName}/trafficStats`,
      });
    },
  },
};
