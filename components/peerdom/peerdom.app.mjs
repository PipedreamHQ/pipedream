import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "peerdom",
  propDefinitions: {
    circleId: {
      type: "string",
      label: "Circle ID",
      description: "The ID of the circle (organization)",
    },
    roleId: {
      type: "string",
      label: "Role ID",
      description: "The ID of the role",
    },
    memberId: {
      type: "string",
      label: "Member ID",
      description: "The ID of the member",
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
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Api-Key": this.$auth.api_key,
        },
      });
    },
    async createRole({
      circleId, roleName, description, linkedDomains,
    }) {
      const data = {
        name: roleName,
        parentId: circleId,
        ...(description && {
          customFields: {
            Description: description,
          },
        }),
        ...(linkedDomains && {
          customFields: {
            LinkedDomains: linkedDomains,
          },
        }),
      };
      return this._makeRequest({
        method: "POST",
        path: "/roles",
        data,
      });
    },
    async assignMemberToRole({
      roleId, memberId,
    }) {
      const data = {
        roleId,
        memberId,
      };
      return this._makeRequest({
        method: "POST",
        path: `/roles/${roleId}/assign`,
        data,
      });
    },
    async updateRole({
      roleId, name, description, linkedDomains,
    }) {
      const data = {
        ...(name && {
          name,
        }),
        ...(description && {
          customFields: {
            Description: description,
          },
        }),
        ...(linkedDomains && {
          customFields: {
            LinkedDomains: linkedDomains,
          },
        }),
      };
      return this._makeRequest({
        method: "PATCH",
        path: `/roles/${roleId}`,
        data,
      });
    },
    async emitNewRoleEvent({ circleId }) {
      // Logic to listen for a new role event
      // and emit the event
    },
    async emitNewMemberEvent({ circleId }) {
      // Logic to listen for a new member event
      // and emit the event
    },
  },
};
