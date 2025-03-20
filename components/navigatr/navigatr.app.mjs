import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "navigatr",
  propDefinitions: {
    providerId: {
      type: "string",
      label: "Provider ID",
      description: "ID of the badge provider",
      async options() {
        const response = await this.getUserDetails();
        const providerIds = response.providers;
        return providerIds.map(({
          name, id,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    recipientHasAccount: {
      type: "boolean",
      label: "Recipient Has Account",
      description: "Does the recipient have an account in the system?",
    },
    recipientId: {
      type: "string",
      label: "Recipient ID",
      description: "ID of the badge recipient",
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "Email of the recipient",
    },
    recipientFirstname: {
      type: "string",
      label: "First Name",
      description: "First Name of the recipient",
    },
    recipientLastname: {
      type: "string",
      label: "Last Name",
      description: "Last Name of the recipient",
    },
    badgeId: {
      type: "string",
      label: "Badge ID",
      description: "ID of the badge to be issued",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.navigatr.app/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          ...headers,
        },
      });
    },

    async issueBadge({
      badgeId, ...args
    }) {
      return this._makeRequest({
        path: `/badge/${badgeId}/issue`,
        method: "put",
        ...args,
      });
    },
    async getUserDetails(args = {}) {
      return this._makeRequest({
        path: "/user_detail/0",
        ...args,
      });
    },
  },
};
