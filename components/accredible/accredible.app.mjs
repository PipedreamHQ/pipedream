import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "accredible",
  propDefinitions: {
    credentialId: {
      type: "string",
      label: "Credential ID",
      description: "The ID of the existing credential",
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "The email of the recipient",
    },
    credentialData: {
      type: "object",
      label: "Credential Data",
      description: "The data of the credential",
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
        data,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Token token=${this.$auth.api_key}`,
        },
        data,
      });
    },
    async getCredential({ credentialId }) {
      return this._makeRequest({
        path: `/credentials/${credentialId}`,
      });
    },
    async createCredential({
      recipientEmail, credentialData,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/credentials",
        data: {
          recipient: {
            email: recipientEmail,
          },
          ...credentialData,
        },
      });
    },
    async updateCredential({
      credentialId, credentialData,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/credentials/${credentialId}`,
        data: credentialData,
      });
    },
    async deleteCredential({ credentialId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/credentials/${credentialId}`,
      });
    },
  },
};
