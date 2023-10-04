import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "accredible",
  propDefinitions: {
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "The email of the recipient",
    },
    credential: {
      type: "object",
      label: "Credential",
      description: "The credential to be issued or modified",
    },
    credentialId: {
      type: "string",
      label: "Credential ID",
      description: "The ID of the credential",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.accredible.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async issueCredential({ recipientEmail, credential, ...opts }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/credentials",
        data: {
          recipient: {
            email: recipientEmail
          },
          ...credential
        },
      });
    },
    async updateCredential({ credentialId, credential, ...opts }) {
      return this._makeRequest({
        ...opts,
        method: "PUT",
        path: `/credentials/${credentialId}`,
        data: credential,
      });
    },
    async deleteCredential({ credentialId, ...opts }) {
      return this._makeRequest({
        ...opts,
        method: "DELETE",
        path: `/credentials/${credentialId}`,
      });
    },
  },
};