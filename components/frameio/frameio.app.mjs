import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "frameio",
  version: "0.0.{{ts}}",
  propDefinitions: {
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "The ID of the asset.",
    },
    commentId: {
      type: "string",
      label: "Comment ID",
      description: "The ID of the comment.",
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The comment message.",
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "The timestamp of the comment.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project.",
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The ID of the team.",
      optional: true,
    },
    updateValues: {
      type: "object",
      label: "Update Values",
      description: "The values to update the asset with.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.frame.io/v2";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    async sendComment({
      assetId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/assets/${assetId}/comments`,
        ...args,
      });
    },
    async createProject(args) {
      return this._makeRequest({
        method: "POST",
        url: "/projects",
        ...args,
      });
    },
    async modifyAsset({
      assetId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/assets/${assetId}`,
        ...args,
      });
    },
  },
};
