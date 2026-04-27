import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "permit_io",
  propDefinitions: {
    projId: {
      type: "string",
      label: "Project ID",
      description: "The project key or ID",
      async options({ page }) {
        const projects = await this.listProjects({
          params: {
            page: page + 1,
            per_page: 100,
          },
        });
        return projects.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    envId: {
      type: "string",
      label: "Environment ID",
      description: "The environment key or ID",
      async options({
        page, projId,
      }) {
        if (!projId) {
          return [];
        }
        const envs = await this.listEnvironments({
          projId,
          params: {
            page: page + 1,
            per_page: 100,
          },
        });
        return envs.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role key or ID (e.g. `admin`, `editor`)",
      async options({
        page, projId, envId,
      }) {
        if (!projId || !envId) {
          return [];
        }
        const response = await this.listRoles({
          projId,
          envId,
          params: {
            page: page + 1,
            per_page: 100,
          },
        });
        const roles = Array.isArray(response)
          ? response
          : response.data;
        return roles.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    user: {
      type: "string",
      label: "User",
      description: "The user key or ID (e.g. `jane@example.com`)",
      async options({
        page, projId, envId,
      }) {
        if (!projId || !envId) {
          return [];
        }
        const response = await this.listUsers({
          projId,
          envId,
          params: {
            page: page + 1,
            per_page: 100,
          },
        });
        const users = Array.isArray(response)
          ? response
          : response.data;
        return users.map(({
          id: value, email, first_name: firstName, last_name: lastName,
        }) => ({
          value,
          label: [
            firstName,
            lastName,
          ].filter(Boolean).join(" ") || email || value,
        }));
      },
    },
    tenant: {
      type: "string",
      label: "Tenant",
      description: "The tenant key or ID (e.g. `stripe-inc`)",
      async options({
        page, projId, envId,
      }) {
        if (!projId || !envId) {
          return [];
        }
        const response = await this.listTenants({
          projId,
          envId,
          params: {
            page: page + 1,
            per_page: 100,
          },
        });
        const tenants = Array.isArray(response)
          ? response
          : response.data;
        return tenants.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.permit.io/v2";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listEnvironments({
      projId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projId}/envs`,
        ...opts,
      });
    },
    listRoles({
      projId, envId, ...opts
    }) {
      return this._makeRequest({
        path: `/schema/${projId}/${envId}/roles`,
        ...opts,
      });
    },
    listUsers({
      projId, envId, ...opts
    }) {
      return this._makeRequest({
        path: `/facts/${projId}/${envId}/users`,
        ...opts,
      });
    },
    listTenants({
      projId, envId, ...opts
    }) {
      return this._makeRequest({
        path: `/facts/${projId}/${envId}/tenants`,
        ...opts,
      });
    },
    assignRole({
      projId, envId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/facts/${projId}/${envId}/role_assignments`,
        ...opts,
      });
    },
    removeRole({
      projId, envId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/facts/${projId}/${envId}/role_assignments`,
        ...opts,
      });
    },
    createTenant({
      projId, envId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/facts/${projId}/${envId}/tenants`,
        ...opts,
      });
    },
    createRelationshipTuple({
      projId, envId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/facts/${projId}/${envId}/relationship_tuples`,
        ...opts,
      });
    },
  },
};
