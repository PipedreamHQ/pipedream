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
    },
  },
  methods: {
    _baseUrl(workspace) {
      return `https://api.thenile.dev/workspaces/${workspace}/databases/${this.$auth.database}`;
    },
    async _getHeaders($, useToken, workspace, email, password) {
      const headers = {
        "Content-Type": "application/json",
      };
      if (useToken) {
        headers.Authorization = `Bearer ${await this.getToken({
          $,
          workspace,
          email,
          password,
        })}`;
      }
      return headers;
    },
    async getToken({
      $, workspace, email, password,
    }) {
      const { token: { jwt } } = await axios($, {
        method: "POST",
        url: `${this._baseUrl(workspace)}/users/login`,
        data: {
          email,
          password,
        },
      });
      return jwt;
    },
    async _makeRequest({
      $ = this,
      path,
      workspace,
      email,
      password,
      useToken = false,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl(workspace)}${path}`,
        headers: await this._getHeaders($, useToken, workspace, email, password),
        ...args,
      });
    },
    listUsers({
      workspace, email, password, ...args
    }) {
      return this._makeRequest({
        path: "/users",
        workspace,
        useToken: true,
        email,
        password,
        ...args,
      });
    },
    createUser({
      workspace, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        workspace,
        ...args,
      });
    },
    getClientConfiguration() {
      const {
        username,
        password,
        host,
        port,
        database,
      } = this.$auth;

      return {
        user: username,
        password,
        host,
        port,
        database,
      };
    },
    async _getClient() {
      const config = this.getClientConfiguration();
      const pool = new pg.Pool(config);
      const client = await pool.connect();
      return client;
    },
    async _endClient(client) {
      return client.release();
    },
    async executeQuery(query) {
      const client = await this._getClient();

      try {
        const { rows } = await client.query(query);
        return rows;
      } finally {
        await this._endClient(client);
      }
    },
    executeQueryAdapter(proxyArgs = {}) {
      const {
        query: text = "",
        params: values = [],
      } = proxyArgs;
      return {
        text,
        values,
      };
    },
    proxyAdapter(query) {
      if (typeof query === "string") {
        return {
          query,
        };
      }

      return {
        query: query.text,
        params: query.values,
      };
    },
    async getSchema() {
      const text = `
        SELECT table_name AS "tableName",
          column_name AS "columnName",
          is_nullable AS "isNullable",
          data_type AS "dataType",
          column_default AS "columnDefault"
        FROM information_schema.columns
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'users', 'auth')
        ORDER BY table_name,
          ordinal_position
      `;
      const rows = await this.executeQuery({
        text,
      });
      return rows.reduce((acc, row) => {
        acc[row.tableName] ??= {
          metadata: {},
          schema: {},
        };
        acc[row.tableName].schema[row.columnName] = {
          ...row,
        };
        return acc;
      }, {});
    },
  },
};
