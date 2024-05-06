import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "pixiebrix",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization",
      async options({ page }) {
        const orgs = await this.listOrganizations({
          params: {
            page: page + 1,
            page_size: constants.DEFAULT_LIMIT,
          },
        });
        return orgs?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group",
      async options({
        organizationId, page,
      }) {
        const groups = await this.listOrganizationGroups({
          organizationId,
          params: {
            page: page + 1,
            page_size: constants.DEFAULT_LIMIT,
          },
        });
        return groups?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({
        organizationId, page,
        mapper = ({
          user: {
            id: value, name, email,
          },
        }) => ({
          label: [
            name,
            email,
          ].join(" ").trim(),
          value,
        }),
      }) {
        const users = await this.listOrganizationMemberships({
          organizationId,
          params: {
            page: page + 1,
            page_size: constants.DEFAULT_LIMIT,
          },
        });
        return users?.map(mapper);
      },
    },
    membershipId: {
      type: "string",
      label: "Membership ID",
      description: "The ID of the group membership",
      async options({
        groupId, page,
      }) {
        const memberships = await this.listGroupMemberships({
          groupId,
          params: {
            page: page + 1,
            page_size: constants.DEFAULT_LIMIT,
          },
        });
        return memberships?.map(({
          id: value, first_name: name, email,
        }) => ({
          label: [
            name,
            email,
          ].join(" ").trim(),
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        "Authorization": `Token ${this.$auth.auth_token}`,
        "Accept": "application/json; version=2.0",
        "Content-Type": "application/json; version=2.0",
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      try {
        const response = await axios($, {
          ...args,
          url: this.getUrl(path),
          headers: this.getHeaders(headers),
        });
        return response;

      } catch (error) {
        if (error.response?.status === 404) {
          return;
        }
        throw error;
      }
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listOrganizations(args = {}) {
      return this._makeRequest({
        path: "/organizations/",
        ...args,
      });
    },
    listOrganizationGroups({
      organizationId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/groups/`,
        ...args,
      });
    },
    listOrganizationMemberships({
      organizationId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/memberships/`,
        ...args,
      });
    },
    listGroupMemberships({
      groupId, ...args
    } = {}) {
      return this._makeRequest({
        headers: {
          "Accept": "application/json; version=1.0",
        },
        path: `/groups/${groupId}/memberships/`,
        ...args,
      });
    },
  },
};
