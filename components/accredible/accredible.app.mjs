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
    recipientName: {
      type: "string",
      label: "Recipient Name",
      description: "The name of the recipient",
    },
    credentialData: {
      type: "object",
      label: "Credential Data",
      description: "The data of the credential",
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group",
      async options({ page }) {
        const { groups } = await this.searchGroups({
          params: {
            page: page + 1,
          },
        });
        return groups.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.accredible.com/v1";
    },
    _makeRequest({
      $ = this, path, headers, ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Token token=${this.$auth.api_key}`,
        },
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "delete",
        ...args,
      });
    },
    getCredential({
      credentialId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/credentials/${credentialId}`,
        ...args,
      });
    },
    createCredential(args = {}) {
      return this.post({
        path: "/credentials",
        ...args,
      });
    },
    updateCredential({
      credentialId, ...args
    } = {}) {
      return this.put({
        path: `/credentials/${credentialId}`,
        ...args,
      });
    },
    deleteCredential({
      credentialId, ...args
    } = {}) {
      return this.delete({
        path: `/credentials/${credentialId}`,
        ...args,
      });
    },
    searchGroups(args = {}) {
      return this.post({
        path: "/issuer/groups/search",
        ...args,
      });
    },
  },
};
