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
     * Paginate an OData collection via @odata.nextLink (dedupes repeated links, caps page count).
     * @param {Object} opts
     * @param {() => Promise<Object>} opts.fetchFirst - First page response
     * @param {(nextLink: string) => Promise<Object>} opts.fetchNext - Next page from URL
     * @param {(item: Object) => any} [opts.mapItem] - Map each item from value[]
     * @param {number} [opts.maxItems] - Stop after this many mapped items
     * @returns {Promise<{ items: any[], truncated: boolean }>}
     */
    async collectODataValues({
      fetchFirst,
      fetchNext,
      mapItem = (x) => x,
      maxItems,
    } = {}) {
      const items = [];
      const seenNextLinks = new Set();
      const MAX_PAGES = 10000;
      let pageCount = 0;
      let truncatedByLimit = false;

      let response = await fetchFirst();

      const append = (valueArray) => {
        const mapped = (valueArray || []).map(mapItem);
        if (maxItems == null) {
          items.push(...mapped);
          return true;
        }
        const remaining = maxItems - items.length;
        if (remaining <= 0) {
          return false;
        }
        if (mapped.length > remaining) {
          items.push(...mapped.slice(0, remaining));
          truncatedByLimit = true;
          return false;
        }
        items.push(...mapped);
        return items.length < maxItems;
      };

      append(response.value);

      while (response["@odata.nextLink"] && pageCount < MAX_PAGES) {
        const nextLink = response["@odata.nextLink"];
        if (seenNextLinks.has(nextLink)) {
          break;
        }
        seenNextLinks.add(nextLink);
        response = await fetchNext(nextLink);
        pageCount += 1;
        if (!append(response.value)) {
          break;
        }
        if (maxItems != null && items.length >= maxItems) {
          break;
        }
      }

      const truncated = truncatedByLimit
        || (maxItems != null && items.length >= maxItems && Boolean(response["@odata.nextLink"]));

      return {
        items,
        truncated,
      };
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
