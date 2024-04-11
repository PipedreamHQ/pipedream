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
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        data,
        params,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    async sendComment({
      assetId, message, timestamp,
    }) {
      const data = {
        text: message,
      };
      if (timestamp) {
        data.timestamp = timestamp;
      }
      return this._makeRequest({
        method: "POST",
        path: `/assets/${assetId}/comments`,
        data,
      });
    },
    async createProject({
      name, teamId,
    }) {
      const data = {
        name,
      };
      if (teamId) {
        data.team_id = teamId;
      }
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        data,
      });
    },
    async modifyAsset({
      assetId, updateValues,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/assets/${assetId}`,
        data: updateValues,
      });
    },
  },
};
