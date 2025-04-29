import { axios } from "@pipedream/platform";
import pg from "pg";

export default {
  type: "app",
  app: "nile_database",
  propDefinitions: {
    workspace: {
      type: "string",
      label: "Workspace",
      description: "Your workspace slug",
      async options() {
        const { workspaces } = await this.getAuthenticatedUser();
        return workspaces?.map(({ slug }) => slug) || [];
      },
    },
    database: {
      type: "string",
      label: "Database",
      description: "The database name",
      async options({ workspace }) {
        if (!workspace) {
          return [];
        }
        const databases = await this.listDatabases({
          workspace,
        });
        return databases?.map(({ name }) => name) || [];
      },
    },
  },
  methods: {
    _globalBaseUrl() {
      return "https://global.thenile.dev";
    },
    async _getBaseUrl({
      workspace, database, ...opts
    }) {
      const { apiHost } = await this.getDatabase({
        workspace,
        database,
        ...opts,
      });
      return apiHost;
    },
    async _makeRequest({
      $ = this,
      workspace,
      database,
      url,
      path,
      ...opts
    }) {
      return axios($, {
        url: url || `${await this._getBaseUrl({
          workspace,
          database,
          $,
        })}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    getDatabase({
      workspace, database, ...opts
    }) {
      return this._makeRequest({
        url: `${this._globalBaseUrl()}/workspaces/${workspace}/databases/${database}`,
        workspace,
        database,
        ...opts,
      });
    },
    listDatabases({
      workspace, ...opts
    }) {
      return this._makeRequest({
        url: `${this._globalBaseUrl()}/workspaces/${workspace}/databases`,
        ...opts,
      });
    },
    getAuthenticatedUser(opts = {}) {
      return this._makeRequest({
        url: `${this._globalBaseUrl()}/developers/me/full`,
        ...opts,
      });
    },
    async getHost({
      workspace, database, ...opts
    }) {
      const { dbHost } = await this.getDatabase({
        workspace,
        database,
        ...opts,
      });
      const host = dbHost.match(/postgres:\/\/([^/]+)\//);
      return host[1];
    },
    listUsers({
      workspace, database, ...opts
    }) {
      return this._makeRequest({
        path: "/users",
        workspace,
        database,
        ...opts,
      });
    },
    listTenants({
      workspace, database, ...opts
    }) {
      return this._makeRequest({
        path: "/tenants",
        workspace,
        database,
        ...opts,
      });
    },
    createUser({
      workspace, database, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        workspace,
        database,
        ...opts,
      });
    },
    async _getClient(config) {
      const pool = new pg.Pool(config);
      const client = await pool.connect();
      return client;
    },
    async _endClient(client) {
      return client.release();
    },
    async executeQuery(config, query) {
      const client = await this._getClient(config);
      try {
        const { rows } = await client.query(query);
        return rows;
      } finally {
        await this._endClient(client);
      }
    },
  },
};
