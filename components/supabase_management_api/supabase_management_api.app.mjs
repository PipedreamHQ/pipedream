import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "supabase_management_api",
  propDefinitions: {
    projectRef: {
      type: "string",
      label: "Project Reference",
      description: "The reference to the Supabase project",
      async options() {
        const projects = await this.listProjects();
        return projects?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization",
      async options() {
        const organizations = await this.listOrganizations();
        return organizations?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    region: {
      type: "string",
      label: "Region",
      description: "The region for the Supabase project",
      options: constants.REGIONS,
    },
    instanceSize: {
      type: "string",
      label: "Instance Size",
      description: "The desired instance size for the Supabase project",
      options: constants.INSTANCE_SIZES,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.supabase.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listOrganizations(opts = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...opts,
      });
    },
    listDatabaseBackups({
      projectRef, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectRef}/database/backups`,
        ...opts,
      });
    },
    generateTypescriptTypes({
      projectRef, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectRef}/types/typescript`,
        ...opts,
      });
    },
    createProject(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        ...opts,
      });
    },
  },
};
