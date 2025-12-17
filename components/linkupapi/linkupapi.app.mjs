import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "linkupapi",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Email address for LinkedIn account",
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password for LinkedIn account",
      secret: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country code for proxy selection",
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
    loginToken: {
      type: "string",
      label: "Login Token",
      description: "LinkedIn authentication token obtained from login/verify process",
      secret: true,
    },
    code: {
      type: "string",
      label: "Verification Code",
      description: "Verification code received via email",
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "LinkedIn profile or company URL. Eg. `https://www.linkedin.com/in/john-doe/` or `https://www.linkedin.com/company/stripe/`",
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "LinkedIn conversation identifier",
      async options({
        prevContext, loginToken,
      }) {
        if (!loginToken || prevContext?.nextCursor === null) {
          return [];
        }
        const {
          data: {
            conversations,
            next_cursor,
          },
        } = await this.getConversations({
          data: {
            login_token: loginToken,
            next_cursor: prevContext?.nextCursor,
          },
        });
        return {
          options: conversations.map(({
            conversation_id: value,
            last_message: { text },
            participant: { name },
          }) => ({
            label: `${name || "Unknown"} - ${text?.substring(0, 50) || "No message"}`,
            value,
          })),
          context: {
            nextCursor: next_cursor,
          },
        };
      },
    },
    messageText: {
      type: "string",
      label: "Message Text",
      description: "Message content",
    },
    location: {
      type: "string[]",
      label: "Locations",
      description: "Geographic locations to filter",
      optional: true,
    },
    companyUrl: {
      type: "string[]",
      label: "Company URLs",
      description: "LinkedIn company URLs. Eg. `https://www.linkedin.com/company/stripe/`",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.linkupapi.com/v1${path}`;
    },
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
        url: this.getUrl(path),
        headers: this._getHeaders(),
      });
    },
    post(opts = {}) {
      return this._makeRequest({
        method: "POST",
        ...opts,
      });
    },
    login(opts = {}) {
      return this.post({
        path: "/auth/login",
        ...opts,
      });
    },
    verify(opts = {}) {
      return this.post({
        path: "/auth/verify",
        ...opts,
      });
    },
    getProfileInfo(opts = {}) {
      return this.post({
        path: "/profile/info",
        ...opts,
      });
    },
    searchProfiles(opts = {}) {
      return this.post({
        path: "/profile/search",
        ...opts,
      });
    },
    searchCompanies(opts = {}) {
      return this.post({
        path: "/companies/search",
        ...opts,
      });
    },
    getCompanyInfo(opts = {}) {
      return this.post({
        path: "/companies/info",
        ...opts,
      });
    },
    connectToProfile(opts = {}) {
      return this.post({
        path: "/network/connect",
        ...opts,
      });
    },
    getInvitationsStatus(opts = {}) {
      return this.post({
        path: "/network/invitations",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this.post({
        path: "/messages/send-message",
        ...opts,
      });
    },
    getConversationMessages(opts = {}) {
      return this.post({
        path: "/messages/conversation",
        ...opts,
      });
    },
    getConversations(opts = {}) {
      return this.post({
        path: "/messages/inbox",
        ...opts,
      });
    },
  },
};
