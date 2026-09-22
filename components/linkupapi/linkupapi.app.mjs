import { axios } from "@pipedream/platform";
import {
  ACTIONS,
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
      description: "LinkedIn conversation identifier. Pick from your inbox, or run **List Inbox** to find one.",
      async options({
        prevContext, accountId,
      }) {
        if (!accountId || prevContext?.nextCursor === null) {
          return [];
        }
        const { data } = await this.listInbox({
          accountId,
          params: {
            cursor: prevContext?.nextCursor,
          },
        });
        const conversations = data?.conversations || [];
        return {
          options: conversations.map((conversation) => ({
            label: `${conversation.participant?.name || "Unknown"} - ${conversation.last_message?.text?.slice(0, 50) || "No message"}`,
            value: conversation.conversation_id,
          })),
          context: {
            nextCursor: data?.next_cursor || null,
          },
        };
      },
    },
    messageText: {
      type: "string",
      label: "Message Text",
      description: "Message content.",
    },
    location: {
      type: "string[]",
      label: "Locations",
      description: "Geographic locations to filter, passed as an array of strings, e.g. `[\"San Francisco, CA\", \"Paris, France\"]`.",
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
    identifier: {
      type: "string",
      label: "Identifier",
      description: "LinkedIn public identifier (public ID) of the target profile.",
      optional: true,
    },
    profileUrn: {
      type: "string",
      label: "Profile URN",
      description: "LinkedIn profile URN of the target (e.g. `ACoAAB...`).",
      optional: true,
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
    _post(opts = {}) {
      return this._makeRequest({
        method: "POST",
        ...opts,
      });
    },
    // Shared wrapper for the V2 action envelope: { account_id, action, params }.
    _action({
      path, action, accountId, params, ...opts
    } = {}) {
      return this._post({
        ...opts,
        path,
        data: {
          account_id: accountId,
          action,
          params,
        },
      });
    },
    async _paginate({
      requestPage, getItems, getNext, max,
    }) {
      const results = [];
      let next;
      let page = [];
      do {
        const response = await requestPage({
          next,
          count: max - results.length,
        });
        page = getItems(response) || [];
        results.push(...page.slice(0, max - results.length));
        next = getNext(response);
      } while (next && page.length && results.length < max);
      return results;
    },
    connectAccount(opts = {}) {
      return this._post({
        path: ENDPOINTS.LOGIN,
        ...opts,
      });
    },
    verifyCheckpoint(opts = {}) {
      return this._post({
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
        path: `${ENDPOINTS.ACCOUNTS}/${encodeURIComponent(accountId)}`,
        ...opts,
      });
    },
    getProfileInfo(opts = {}) {
      return this._action({
        path: ENDPOINTS.PROFILES,
        action: ACTIONS.GET,
        ...opts,
      });
    },
    searchProfiles(opts = {}) {
      return this._action({
        path: ENDPOINTS.PROFILES,
        action: ACTIONS.SEARCH_PEOPLE,
        ...opts,
      });
    },
    searchCompanies(opts = {}) {
      return this._action({
        path: ENDPOINTS.PROFILES,
        action: ACTIONS.SEARCH_COMPANIES,
        ...opts,
      });
    },
    getCompanyInfo(opts = {}) {
      return this._action({
        path: ENDPOINTS.PROFILES,
        action: ACTIONS.GET_COMPANY,
        ...opts,
      });
    },
    connectToProfile(opts = {}) {
      return this._action({
        path: ENDPOINTS.NETWORK,
        action: ACTIONS.INVITE,
        ...opts,
      });
    },
    getInvitations(opts = {}) {
      return this._action({
        path: ENDPOINTS.NETWORK,
        action: ACTIONS.LIST_INVITATIONS,
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._action({
        path: ENDPOINTS.MESSAGES,
        action: ACTIONS.SEND,
        ...opts,
      });
    },
    getConversationMessages(opts = {}) {
      return this._action({
        path: ENDPOINTS.MESSAGES,
        action: ACTIONS.GET_CONVERSATION,
        ...opts,
      });
    },
    listInbox(opts = {}) {
      return this._action({
        path: ENDPOINTS.MESSAGES,
        action: ACTIONS.LIST_INBOX,
        ...opts,
      });
    },
    createComment(opts = {}) {
      return this._action({
        path: ENDPOINTS.CONTENT,
        action: ACTIONS.COMMENT,
        ...opts,
      });
    },
  },
};
