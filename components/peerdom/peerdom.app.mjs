import { axios } from "@pipedream/platform";
import {
  LIMIT, SHAPE_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "peerdom",
  propDefinitions: {
    groupId: {
      type: "string",
      label: "Parent ID",
      description: "The ID should be a valid group ID.",
      async options() {
        const data = await this.listGroups();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    mapId: {
      type: "string",
      label: "Map ID",
      description: "The ID of the map",
      async options() {
        const data = await this.listMaps();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    roleId: {
      type: "string",
      label: "Role ID",
      description: "ID of role to update.",
      async options() {
        const data = await this.listRoles();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    memberId: {
      type: "string",
      label: "Member ID",
      description: "The ID of the member",
      async options() {
        const data = await this.listPeers();

        return data.map(({
          id: value, firstName, lastName,
        }) => ({
          label: `${firstName} ${lastName}`,
          value,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the role to be created",
    },
    electable: {
      type: "boolean",
      label: "Electable",
      description: "Whether the role is electable or not",
    },
    external: {
      type: "boolean",
      label: "External",
      description: "Set to `true` if node is outside of the organization",
    },
    color: {
      type: "string",
      label: "Color",
      description: "The choice of color for the node in hexadecimal string format, e.g. `#f3a935`",
    },
    shape: {
      type: "string",
      label: "Shape",
      description: "Specifies the shape of the node that determines the visual representation of the node within the interface",
      options: SHAPE_OPTIONS,
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "The custom fields for a group/role. You can add the properties from the predefined custom fields. [See the documentation](https://api.peerdom.org/v1/docs#tag/Roles/operation/postRole) for further details.",
    },
    groupEmail: {
      type: "string",
      label: "Group Email",
      description: "Email for node (group/role) communication",
      optional: true,
    },

    circleId: {
      type: "string",
      label: "Circle ID",
      description: "The ID of the circle (organization)",
    },
    roleName: {
      type: "string",
      label: "Role Name",
      description: "The name of the role to be created",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description for the role",
      optional: true,
    },
    linkedDomains: {
      type: "string[]",
      label: "Linked Domains",
      description: "Optional linked domains for the role",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.peerdom.org/v1";
    },
    _headers() {
      return {
        "content-type": "application/json",
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/groups",
        ...opts,
      });
    },
    listMaps(opts = {}) {
      return this._makeRequest({
        path: "/maps",
        ...opts,
      });
    },
    listRoles(opts = {}) {
      return this._makeRequest({
        path: "/roles",
        ...opts,
      });
    },
    listPeers(opts = {}) {
      return this._makeRequest({
        path: "/peers",
        ...opts,
      });
    },
    createRole(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/roles",
        ...opts,
      });
    },
    updateRole({
      roleId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/roles/${roleId}`,
        ...opts,
      });
    },
    async assignMemberToRole({
      roleId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/roles/${roleId}/peers`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = (LIMIT * page++) + 1;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
