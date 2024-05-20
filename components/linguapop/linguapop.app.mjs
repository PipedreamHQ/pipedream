import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "linguapop",
  propDefinitions: {
    language: {
      type: "string",
      label: "Language",
      description: "The language for the test",
      required: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID",
      optional: true,
    },
    testLevel: {
      type: "string",
      label: "Test Level",
      description: "The level of the test",
      optional: true,
    },
    recipientEmail: {
      type: "string",
      label: "Recipient's Email",
      description: "The email of the recipient for the test invitation",
      required: true,
    },
    invitationContent: {
      type: "string",
      label: "Invitation Content",
      description: "The content of the invitation email",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://app.linguapop.eu/api";
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
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createTestInvitation({
      language, recipientEmail, invitationContent,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/actions/sendInvitation",
        data: {
          apiKey: this.$auth.api_key,
          email: recipientEmail,
          languageCode: language,
          sendEmail: true,
          testReading: false,
          testListening: false,
          callbackUrl: "https://YOUR_CALLBACK_URL",
          content: invitationContent,
        },
      });
    },
    async emitTestCompletionEvent({
      language, userId, testLevel,
    }) {
      this.$emit({
        language,
        userId,
        testLevel,
      }, {
        summary: `Placement test completed in ${language} by ${userId || "unknown user"} at level ${testLevel || "unknown level"}`,
      });
    },
  },
};
