import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

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
    client() {
      return Client.init({
        authProvider: (done) => {
          done(null, this.$auth.oauth_access_token);
        },
      });
    },
    listGroups({
      url, params = {},
    } = {}) {
      const client = this.client();
      return url
        ? client.api(url)
          .query(params)
          .get()
        : client.api("/groups")
          .header("ConsistencyLevel", "eventual")
          .query(params)
          .get();
    },
    listGroupMembers({
      groupId, url, params = {},
    } = {}) {
      const client = this.client();
      return url
        ? client.api(url)
          .query(params)
          .get()
        : client.api(`/groups/${groupId}/members`)
          .header("ConsistencyLevel", "eventual")
          .query(params)
          .get();
    },
    listUsers({
      url, params = {},
    } = {}) {
      const client = this.client();
      return url
        ? client.api(url)
          .query(params)
          .get()
        : client.api("/users")
          .header("ConsistencyLevel", "eventual")
          .query(params)
          .get();
    },
    updateUser({
      userId, data = {},
    } = {}) {
      return this.client().api(`/users/${userId}`)
        .header("ConsistencyLevel", "eventual")
        .patch(data);
    },
    addMemberToGroup({
      groupId, data = {},
    } = {}) {
      return this.client().api(`/groups/${groupId}/members/$ref`)
        .header("ConsistencyLevel", "eventual")
        .post(data);
    },
    removeMemberFromGroup({
      groupId, userId,
    } = {}) {
      return this.client().api(`/groups/${groupId}/members/${userId}/$ref`)
        .header("ConsistencyLevel", "eventual")
        .delete();
    },
    /**
     * Get the user's manager information.
     * @param {Object} opts - Options for the request
     * @param {string} [opts.userId] - User ID or userPrincipalName. If not provided, uses /me
     * @returns {Promise<Object>} Manager data
     */
    async getManager({ userId } = {}) {
      const path = userId
        ? `/users/${userId}/manager`
        : "/me/manager";
      return this.client()
        .api(path)
        .get();
    },
    /**
     * Get the user's profile information.
     * @param {Object} opts - Options for the request
     * @param {string} [opts.userId] - User ID or userPrincipalName. If not provided, uses /me
     * @returns {Promise<Object>} User profile
     */
    async getProfile({ userId } = {}) {
      const path = userId
        ? `/users/${userId}`
        : "/me";
      return this.client()
        .api(path)
        .get();
    },
    /**
     * Get the user's Microsoft 365 groups (unified groups).
     * @param {Object} opts - Options for the request
     * @param {string} [opts.userId] - User ID or userPrincipalName. If not provided, uses /me
     * @param {string} [opts.nextLink] - OData nextLink URL for pagination
     * @returns {Promise<Object>} Response with value array and @odata.nextLink
     */
    getMS365Groups({
      userId, nextLink,
    } = {}) {
      const client = this.client();
      const filter = "groupTypes/any(a:a eq 'Unified')";

      if (nextLink) {
        return client.api(nextLink)
          .header("ConsistencyLevel", "eventual")
          .get();
      }

      const path = userId
        ? `/users/${userId}/memberOf/microsoft.graph.group`
        : "/me/memberOf/microsoft.graph.group";
      return client.api(path)
        .header("ConsistencyLevel", "eventual")
        .query({
          $filter: filter,
        })
        .get();
    },
  },
};
