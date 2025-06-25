import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "yay_com",
  propDefinitions: {
    sipUser: {
      type: "string",
      label: "SIP User",
      description: "The SIP user to make the outbound call for",
      async options() {
        const { result } = await this.listSipUsers();
        return result?.map(({
          uuid: value, display_name, user_name,
        }) => ({
          label: display_name || user_name,
          value,
        })) || [];
      },
    },
    sipUsers: {
      type: "string[]",
      label: "SIP Users",
      description: "List of SIP users who will receive the outbound call request",
      optional: true,
      async options() {
        const { result } = await this.listSipUsers();
        return result?.map(({
          uuid: value, display_name, user_name,
        }) => ({
          label: display_name || user_name,
          value,
        })) || [];
      },
    },
    huntGroups: {
      type: "string[]",
      label: "Hunt Groups",
      description: "List of hunt groups who will receive the outbound call request",
      optional: true,
      async options() {
        const { result } = await this.listHuntGroups();
        return result?.map(({
          uuid: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    destination: {
      type: "string",
      label: "Destination",
      description: "The destination phone number to call (in E164 format for outbound calls). You may also provide extension numbers of your hunt groups, users and call routes.",
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "What display name should be sent to the user, this will show as the name on their phone (where supported)",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://${this.$auth.api_hostname}`;
    },
    _getHeaders() {
      return {
        "x-auth-reseller": `${this.$auth.reseller}`,
        "x-auth-user": `${this.$auth.user}`,
        "x-auth-password": `${this.$auth.password}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...args
    }) {
      const response = await axios($, {
        url: `${this._getBaseUrl()}${path}`,
        headers: {
          ...headers,
          ...this._getHeaders(),
        },
        ...args,
      });
      return response.result;
    },
    async listSipUsers(args) {
      return this._makeRequest({
        path: "/voip/user",
        ...args,
      });
    },
    async listHuntGroups(args) {
      return this._makeRequest({
        path: "/voip/group",
        ...args,
      });
    },
    async listPhoneBooks(args) {
      return this._makeRequest({
        path: "/phone-book",
        ...args,
      });
    },
    async listDocuments(args) {
      return this._makeRequest({
        path: "/account/document",
        ...args,
      });
    },
    async createOutboundCall({
      $,
      userUuid,
      destination,
      displayName,
      sipUsers = [],
      huntGroups = [],
    }) {
      // Combine sipUsers and huntGroups into the targets array
      const targets = [
        ...sipUsers.map((uuid) => ({
          type: "sipuser",
          uuid,
        })),
        ...huntGroups.map((uuid) => ({
          type: "huntgroup",
          uuid,
        })),
      ];

      return this._makeRequest({
        $,
        method: "POST",
        path: "/calls/outbound",
        data: {
          user_uuid: userUuid,
          destination,
          display_name: displayName,
          ...(targets.length > 0 && {
            targets,
          }),
        },
      });
    },
  },
};
