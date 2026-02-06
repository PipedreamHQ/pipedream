import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_entra_id",
  propDefinitions: {
    groupId: {
      type: "string",
      label: "Group",
      description: "Identifier of a group",
      async options({ prevContext }) {
        const args = prevContext?.nextLink
          ? {
            url: prevContext.nextLink,
          }
          : {};
        const response = await this.listGroups(args);
        const options = response.value?.map(({
          id: value, displayName: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User",
      description: "Identifier of a user",
      async options({
        groupId, prevContext,
      }) {
        const args = {};
        if (prevContext?.nextLink) {
          args.url = prevContext.nextLink;
        }
        const response = groupId
          ? await this.listGroupMembers({
            ...args,
            groupId,
          })
          : await this.listUsers(args);
        const options = response.value?.map(({
          id: value, displayName: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ConsistencyLevel: "eventual",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      url,
      ...args
    }) {
      try {
        return await axios($, {
          url: url || `${this._baseUrl()}${path}`,
          headers: this._headers(),
          ...args,
        });
      } catch (error) {
        throw new ConfigurationError(error.message);
      }
    },
    listGroups(args = {}) {
      return this._makeRequest({
        path: "/groups",
        ...args,
      });
    },
    listGroupMembers({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/members`,
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    updateUser({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `/users/${userId}`,
        method: "PATCH",
        ...args,
      });
    },
    addMemberToGroup({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/members/$ref`,
        method: "POST",
        ...args,
      });
    },
    removeMemberFromGroup({
      groupId, userId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/members/${userId}/$ref`,
        method: "DELETE",
        ...args,
      });
    },
  },
};
