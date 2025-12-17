import { axios } from "@pipedream/platform";
import {
  LIMIT,
  SCHEMA_REFRESH_ACCESS_OPTIONS,
  SHARING_WORKSPACE_GUESTS_OPTIONS,
  SHARING_WORKSPACE_PUBLIC_OPTIONS,
  TYPE_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "hex",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project to run.",
      async options({ prevContext }) {
        return await this.parseOptions({
          fn: this.listProjects,
          params: {
            after: prevContext.after,
          },
          mapper: (item) => ({
            label: item.title,
            value: item.id,
          }),
        });
      },
    },
    runId: {
      type: "string",
      label: "Run ID",
      description: "The ID of the run to get the status of.",
      async options({
        projectId, page,
      }) {
        const { runs } = await this.listRuns({
          projectId,
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return runs.map((item) => item.runId);
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to deactivate.",
      async options({ prevContext }) {
        return await this.parseOptions({
          fn: this.listUsers,
          params: {
            after: prevContext.after,
          },
          mapper: (item) => ({
            label: `${item.name} (${item.email})`,
            value: item.id,
          }),
        });
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group to update.",
      async options({ prevContext }) {
        return await this.parseOptions({
          fn: this.listGroups,
          params: {
            after: prevContext.after,
          },
          mapper: (item) => ({
            label: item.name,
            value: item.id,
          }),
        });
      },
    },
    connectionId: {
      type: "string",
      label: "Connection ID",
      description: "The ID of the connection to update.",
      async options({ prevContext }) {
        return await this.parseOptions({
          fn: this.listDataConnections,
          params: {
            after: prevContext.after,
          },
          mapper: (item) => ({
            label: item.name,
            value: item.id,
          }),
        });
      },
    },
    sharingWorkspacePublic: {
      type: "string",
      label: "Sharing Workspace Public",
      description: "Data connection public sharing access level.",
      optional: true,
      options: SHARING_WORKSPACE_PUBLIC_OPTIONS,
    },
    sharingWorkspaceGuests: {
      type: "string",
      label: "Sharing Workspace Guests",
      description: "Data connection guests sharing access level.",
      optional: true,
      options: SHARING_WORKSPACE_GUESTS_OPTIONS,
    },
    sharingWorkspaceMembers: {
      type: "string",
      label: "Sharing Workspace Members",
      description: "Data connection members sharing access level.",
      optional: true,
      options: SHARING_WORKSPACE_GUESTS_OPTIONS,
    },
    groups: {
      type: "string[]",
      label: "Groups",
      description: "A list of group objects containing the group ID and access level. Example: [{ \"group\": {\"id\": \"5dddb613-224d-41b2-93ae-399755ad5fb3\"}, \"access\": \"VIEW_RESULTS\" }]",
      optional: true,
    },
    schemaRefreshAccess: {
      type: "string",
      label: "Schema Refresh Access",
      description: "Schema refresh access level.",
      optional: true,
      options: SCHEMA_REFRESH_ACCESS_OPTIONS,
    },
    schemaRefreshSchedule: {
      type: "object",
      label: "Schema Refresh Schedule",
      description: "An object with the schema refresh schedule data. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/CreateDataConnection) for more information. E.g. { \"cadence\": \"DAILY\", \"enabled\": true, \"daily\": {\"timezoneString\": \"America/New_York\", \"hour\": 12, \"minute\": 0 } }",
      optional: true,
    },
    schemaFilters: {
      type: "object",
      label: "Schema Filters",
      description: "An object with the schema filters data. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/CreateDataConnection) for more information. E.g. { \"tables\": {\"exclude\": {\"values\": [\"table1\", \"table2\"], \"matchType\": \"EXACT\"}}, \"schemas\": {\"include\": {\"values\": [\"schema1\", \"schema2\"], \"matchType\": \"PREFIX\"}}}",
      optional: true,
    },
    allowWritebackCells: {
      type: "boolean",
      label: "Allow Writeback Cells",
      description: "Allow writeback cells.",
      optional: true,
    },
    includeMagic: {
      type: "boolean",
      label: "Include Magic",
      description: "Include magic.",
      optional: true,
    },
    connectViaSsh: {
      type: "boolean",
      label: "Connect Via SSH",
      description: "Connect via SSH.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the data connection.",
      optional: true,
    },
    connectionDetails: {
      type: "object",
      label: "Connection Details",
      description: "An object with the connection details data. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/CreateDataConnection) for more information. E.g. { \"bigquery\": { \"serviceAccountJsonConfig\": \"string\", \"enableStorageApi\": true, \"enableDriveAccess\": true, \"projectId\": \"string\" }}",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the data connection.",
      options: TYPE_OPTIONS,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the data connection.",
    },
  },
  methods: {
    _apiUrl() {
      return `https://${this.$auth.subdomain}.hex.tech/api/v1`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    async parseOptions({
      fn, params = {}, mapper = (item) => item, ...opts
    }) {
      const {
        values, pagination,
      } = await fn({
        params,
        ...opts,
      });
      return {
        options: values.map(mapper),
        context: {
          after: pagination.after,
        },
      };
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "projects",
      });
    },
    listRuns({
      projectId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `projects/${projectId}/runs`,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "users",
      });
    },
    deactivateUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `users/${userId}/deactivate`,
        ...opts,
      });
    },
    runProject({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `projects/${projectId}/runs`,
        ...opts,
      });
    },
    createGroup(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "groups",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "groups",
      });
    },
    listDataConnections(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "data-connections",
      });
    },
    updateGroup({
      groupId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `groups/${groupId}`,
        ...opts,
      });
    },
    deleteGroup({
      groupId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `groups/${groupId}`,
        ...opts,
      });
    },
    createDataConnection(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "data-connections",
        ...opts,
      });
    },
    updateDataConnection({
      connectionId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `data-connections/${connectionId}`,
        ...opts,
      });
    },
    getProjectRuns({
      projectId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `projects/${projectId}/runs`,
      });
    },
    getRunStatus({
      projectId, runId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `projects/${projectId}/runs/${runId}`,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;

      do {
        if (hasMore) {
          params.after = hasMore;
        }
        const {
          values: data,
          pagination: { after },
        } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = after;

      } while (hasMore);
    },
    async *paginateProjectRuns({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page++;
        const { runs } = await fn({
          params,
          ...opts,
        });
        for (const run of runs) {
          yield run;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = runs.length;

      } while (hasMore);
    },
  },
};
