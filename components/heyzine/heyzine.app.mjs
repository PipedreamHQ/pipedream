import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "heyzine",
  propDefinitions: {
    flipbookId: {
      type: "string",
      label: "Flipbook ID",
      description: "The ID of the flipbook",
    },
    accessType: {
      type: "string",
      label: "Access Type",
      description: "The type of access being granted (user, password or otp)",
      options: [
        "user",
        "password",
        "otp",
      ],
    },
    identifier: {
      type: "string",
      label: "Identifier",
      description: "The appropriate identifier for the access type",
    },
    sourceFile: {
      type: "string",
      label: "Source File",
      description: "The source file to be converted into a flipbook",
    },
    targetDestination: {
      type: "string",
      label: "Target Destination",
      description: "The target destination within your account",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.heyzine.com";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitLeadCollectionEvent(flipbookId) {
      return this._makeRequest({
        method: "POST",
        path: `/flipbooks/${flipbookId}/leads`,
      });
    },
    async emitFlipbookCreatedEvent() {
      return this._makeRequest({
        method: "POST",
        path: "/flipbooks",
      });
    },
    async addUserToAccessList(flipbookId, accessType, identifier) {
      return this._makeRequest({
        method: "POST",
        path: `/flipbooks/${flipbookId}/access`,
        data: {
          type: accessType,
          identifier,
        },
      });
    },
    async generateNewFlipbook(sourceFile, targetDestination) {
      return this._makeRequest({
        method: "POST",
        path: "/flipbooks",
        data: {
          sourceFile,
          targetDestination,
        },
      });
    },
  },
};
