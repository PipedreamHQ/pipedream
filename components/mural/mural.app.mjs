import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mural",
  propDefinitions: {
    muralId: {
      type: "string",
      label: "Mural ID",
      description: "The ID of the Mural.",
      required: true,
    },
    stickyId: {
      type: "string",
      label: "Sticky ID",
      description: "The ID of the Sticky Note.",
      required: true,
    },
    stickyContent: {
      type: "string",
      label: "Sticky Content",
      description: "The content of the Sticky Note.",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the User.",
      required: true,
    },
    muralTitle: {
      type: "string",
      label: "Mural Title",
      description: "The title of the Mural.",
      optional: true,
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of the Workspace.",
      required: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the Mural.",
      required: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A short description of the Mural.",
      optional: true,
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of a pre-existing design.",
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "The color of the Sticky Note.",
      optional: true,
    },
    position: {
      type: "string",
      label: "Position",
      description: "The position of the Sticky Note.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.mural.co/api/public";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createMural(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/murals",
        ...opts,
      });
    },
    async createSticky(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/murals/sticky",
        ...opts,
      });
    },
  },
};
