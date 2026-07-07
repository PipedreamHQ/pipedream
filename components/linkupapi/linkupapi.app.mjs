import { axios } from "@pipedream/platform";
import {
  BASE_URL,
  ENDPOINTS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "linkupapi",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Email address for the LinkedIn account.",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password for the LinkedIn account.",
      secret: true,
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country code for proxy selection (e.g. `US`, `UK`, `FR`). Defaults to `FR` server-side.",
      optional: true,
      options: [
        "US",
        "UK",
        "FR",
        "DE",
        "NL",
        "IT",
        "IL",
        "CA",
        "BR",
        "ES",
        "IN",
      ],
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The persistent account identifier (e.g. `acc_abc123`). Run **Connect Account** to create one, or **List Accounts** to look up existing account IDs.",
    },
    code: {
      type: "string",
      label: "Verification Code",
      description: "Verification code received via email or challenge.",
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "LinkedIn profile or company URL. Eg. `https://www.linkedin.com/in/john-doe/` or `https://www.linkedin.com/company/stripe/`",
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "LinkedIn conversation identifier (free-form string).",
    },
    messageText: {
      type: "string",
      label: "Message Text",
      description: "Message content.",
    },
    location: {
      type: "string[]",
      label: "Locations",
      description: "Geographic locations to filter (passed as an array of strings in V2).",
      optional: true,
    },
    companyUrl: {
      type: "string[]",
      label: "Company URLs",
      description: "LinkedIn company URLs to filter (passed as an array). Eg. `https://www.linkedin.com/company/stripe/`",
      optional: true,
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Free-text keyword to search by.",
      optional: true,
    },
    totalResults: {
      type: "integer",
      label: "Total Results",
      description: "Maximum number of results to return.",
      optional: true,
      min: 1,
      default: 50,
    },
  },
  methods: {
    _getHeaders() {
      return {
        "x-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    } = {}) {
      return axios($, {
        ...opts,
        url: `${BASE_URL}${path}`,
        headers: this._getHeaders(),
      });
    },
    post(opts = {}) {
      return this._makeRequest({
        method: "POST",
        ...opts,
      });
    },
    connectAccount(opts = {}) {
      return this.post({
        path: ENDPOINTS.LOGIN,
        ...opts,
      });
    },
    verifyCheckpoint(opts = {}) {
      return this.post({
        path: ENDPOINTS.CHECKPOINT,
        ...opts,
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: ENDPOINTS.ACCOUNTS,
        ...opts,
      });
    },
    getAccountDetails({
      accountId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `${ENDPOINTS.ACCOUNTS}/${accountId}`,
        ...opts,
      });
    },
    profiles(opts = {}) {
      return this.post({
        path: ENDPOINTS.PROFILES,
        ...opts,
      });
    },
    network(opts = {}) {
      return this.post({
        path: ENDPOINTS.NETWORK,
        ...opts,
      });
    },
    messages(opts = {}) {
      return this.post({
        path: ENDPOINTS.MESSAGES,
        ...opts,
      });
    },
    content(opts = {}) {
      return this.post({
        path: ENDPOINTS.CONTENT,
        ...opts,
      });
    },
  },
};
