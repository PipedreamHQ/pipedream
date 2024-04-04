import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pixiebrix",
  propDefinitions: {
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
    },
    userEmail: {
      type: "string",
      label: "User Email",
      description: "The email of the user",
    },
    membershipId: {
      type: "string",
      label: "Membership ID",
      description: "The ID of the group membership",
    },
    members: {
      type: "string[]",
      label: "Members",
      description: "List of members to add or update in the group, as JSON strings",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.pixiebrix.com/api";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listGroupMemberships({ groupId }) {
      return this._makeRequest({
        path: `/groups/${groupId}/memberships/`,
      });
    },
    async addGroupMemberships({
      groupId, members,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/groups/${groupId}/memberships/`,
        data: members.map(JSON.parse),
      });
    },
    async updateGroupMemberships({
      groupId, members,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/groups/${groupId}/memberships/`,
        data: members.map(JSON.parse),
      });
    },
    async deleteGroupMembership({
      groupId, membershipId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/groups/${groupId}/memberships/${membershipId}/`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
