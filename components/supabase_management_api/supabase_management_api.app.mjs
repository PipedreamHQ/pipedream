import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "supabase_management_api",
  propDefinitions: {
    projectRef: {
      type: "string",
      label: "Project Reference",
      description: "The reference to the Supabase project",
    },
    includedSchemas: {
      type: "string",
      label: "Included Schemas",
      description: "Schemas to be included in the TypeScript types generation",
      optional: true,
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization",
    },
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project",
    },
    dbPassword: {
      type: "string",
      label: "Database Password",
      description: "The password for the database",
    },
    region: {
      type: "string",
      label: "Region",
      description: "The region for the Supabase project",
    },
    instanceSize: {
      type: "string",
      label: "Instance Size",
      description: "The desired instance size for the Supabase project",
      optional: true,
    },
    templateUrl: {
      type: "string",
      label: "Template URL",
      description: "The template URL used to create the project from the CLI",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://supabase.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        data,
        params,
      });
    },
    async listDatabaseBackups(projectRef) {
      return this._makeRequest({
        path: `/v1/projects/${projectRef}/database/backups`,
      });
    },
    async generateTypescriptTypes(projectRef, includedSchemas) {
      return this._makeRequest({
        path: `/v1/projects/${projectRef}/types/typescript`,
        params: {
          included_schemas: includedSchemas,
        },
      });
    },
    async createProject(
      organizationId,
      projectName,
      databasePassword,
      region,
      instanceSize,
      templateUrl,
    ) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/projects",
        data: {
          organization_id: organizationId,
          name: projectName,
          db_pass: databasePassword,
          region,
          desired_instance_size: instanceSize,
          template_url: templateUrl,
        },
      });
    },
  },
};
