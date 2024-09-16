import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "xata",
  propDefinitions: {
    recordId: {
      type: "string",
      label: "Record ID",
      description: "ID of the record to create or update",
      async options({
        endpoint, database, branch, table,
      }) {
        const response = await this.listRecords({
          endpoint,
          database,
          branch,
          table,
        });
        const recordIds = response.records;
        return recordIds.map(({ id }) => ({
          value: id,
        }));
      },
    },
    table: {
      type: "string",
      label: "Table Name",
      description: "Name of the table",
    },
    endpoint: {
      type: "string",
      label: "HTTP Endpoint",
      description: "The endpoint of your database, i.e.: `https://my-workspace-123456.us-east-1.xata.sh`. You can find your workspace domain by navigating to the Configuration tab in the Xata Web UI",
    },
    recordData: {
      type: "object",
      label: "Record Data",
      description: "The key and value of the data that will be recorded in the database",
    },
    workspace: {
      type: "string",
      label: "Workspace ID",
      description: "ID of your workspace",
      async options() {
        const response = await this.listWorkspaces();
        const workspaceIds = response.workspaces;
        return workspaceIds.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    database: {
      type: "string",
      label: "Database Name",
      description: "Name of the database",
      async options({ workspace }) {
        const response = await this.listDatabases({
          workspace,
        });
        const databaseNames = response.databases;
        return databaseNames.map(({ name }) => ({
          value: name,
          label: name,
        }));
      },
    },
    branch: {
      type: "string",
      label: "Branch Name",
      description: "Name of the branch",
      async options({
        endpoint, database,
      }) {
        const response = await this.listBranches({
          endpoint,
          database,
        });
        const branchNames = response.branches;
        return branchNames.map(({ name }) => ({
          value: name,
          label: name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.xata.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        url,
        headers,
        ...otherOpts
      } = opts;
      const finalUrl = url || (this._baseUrl() + path);
      return axios($, {
        ...otherOpts,
        url: finalUrl,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createRecord({
      endpoint, database, branch, table, ...args
    }) {
      return this._makeRequest({
        method: "post",
        url: `${endpoint}/db/${database}:${branch}/tables/${table}/data`,
        ...args,
      });
    },
    async replaceRecord({
      endpoint, database, branch, table, recordId, ...args
    }) {
      return this._makeRequest({
        method: "put",
        url: `${endpoint}/db/${database}:${branch}/tables/${table}/data/${recordId}`,
        ...args,
      });
    },
    async updateRecord({
      endpoint, database, branch, table, recordId, ...args
    }) {
      return this._makeRequest({
        method: "post",
        url: `${endpoint}/db/${database}:${branch}/tables/${table}/data/${recordId}`,
        ...args,
      });
    },
    async listRecords({
      endpoint, database, branch, table, ...args
    }) {
      return this._makeRequest({
        method: "post",
        url: `${endpoint}/db/${database}:${branch}/tables/${table}/query`,
        ...args,
      });
    },
    async listWorkspaces(args = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...args,
      });
    },
    async listDatabases({
      workspace, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspace}/dbs`,
        ...args,
      });
    },
    async listBranches({
      endpoint, database, ...args
    }) {
      return this._makeRequest({
        url: `${endpoint}/dbs/${database}`,
        ...args,
      });
    },
  },
};
