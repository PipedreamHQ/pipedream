import { axios } from "@pipedream/platform";
import {
  ERROR_OPTIONS, REPUTATION_OPTIONS,
} from "./common/constants.mjs";

const percentageRatioText = "(can be a percentage, e.g. `10%` or a ratio between 0 and 1, e.g. `0.1`)";

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
    matchAllFilters: {
      type: "boolean",
      label: "Match All Filters",
      description: "If `true`, events will only be emitted if they match **all** of the selected criteria. The default behavior is matching any of them.",
      optional: true,
      default: false,
    },
    ipReputation: {
      type: "string[]",
      label: "IP Reputation",
      description: "Emit events only when there is at least one IP address in one of the specified categories",
      options: REPUTATION_OPTIONS,
      optional: true,
    },
    domainReputation: {
      type: "string[]",
      label: "Domain Reputation",
      description: "Emit events only when the domain reputation matches one of the specified categories",
      options: REPUTATION_OPTIONS,
      optional: true,
    },
    userReportedSpamRatio: {
      type: "string",
      label: "User Reported Spam Ratio Greater Than or Equal To",
      description: `Emit events only when the user reported spam ratio is greater than, or equal to, the specified value ${percentageRatioText}`,
      optional: true,
    },
    spfSuccessRatio: {
      type: "string",
      label: "SPF Success Ratio Less Than",
      description: `Emit events only when the SPF success ratio is less than the specified value ${percentageRatioText}`,
      optional: true,
    },
    dkimSuccessRatio: {
      type: "string",
      label: "DKIM Success Ratio Less Than",
      description: `Emit events only when the DKIM success ratio is less than the specified value ${percentageRatioText}`,
      optional: true,
    },
    dmarcSuccessRatio: {
      type: "string",
      label: "DMARC Success Ratio Less Than",
      description: `Emit events only when the DMARC success ratio is less than the specified value ${percentageRatioText}`,
      optional: true,
    },
    outboundEncryptionRatio: {
      type: "string",
      label: "Outbound Encryption Ratio Less Than",
      description: `Emit events only when the outbound encryption ratio is less than the specified value ${percentageRatioText}`,
      optional: true,
    },
    inboundEncryptionRatio: {
      type: "string",
      label: "Inbound Encryption Ratio Less Than",
      description: `Emit events only when the inbound encryption ratio is less than the specified value ${percentageRatioText}`,
      optional: true,
    },
    errorRatio: {
      type: "string",
      label: "Error Ratio Greater Than or Equal To",
      description: `Emit events only when the error ratio (in the specified \`Error Categories\`, or any if not specified) is greater than, or equal to, the specified value ${percentageRatioText}`,
      optional: true,
    },
    errorCategories: {
      type: "string",
      label: "Error Categories",
      description: "Emit events only when one of the specified categories equals or exceeds the specified `Error Ratio`",
      options: ERROR_OPTIONS,
      optional: true,
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
    async getDomainTrafficStats({
      domainName, ...args
    }) {
      return this._makeRequest({
        url: `/domains/${domainName}/trafficStats`,
        ...args,
      });
    },
  },
};
