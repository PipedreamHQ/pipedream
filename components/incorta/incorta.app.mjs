import pg from "pg";
import {
  axios, ConfigurationError, sqlProp, sqlProxy,
} from "@pipedream/platform";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "incorta",
  propDefinitions: {
    // --- SQLi connection props (execute-sql-query) ---
    // SQLi (Incorta's SQL Interface) speaks the raw PostgreSQL wire protocol
    // and uses mixed-mode username/password authentication, separate from
    // the REST API's bearer token. Each is optional here and falls back to
    // the matching optional `$auth` field (username/password/port) when not
    // supplied as a prop. Host and database are NOT props: host is resolved
    // dynamically via the REST /configs/sqlConnection endpoint (it's
    // per-cluster and not guessable — see getSqliConnection()), and database
    // is just the tenant name, already available from $auth. Port falls back
    // to that same endpoint when neither the prop nor $auth supplies it.
    username: {
      type: "string",
      label: "SQLi Username",
      description: "Username for SQLi authentication, e.g. `pipedream_reader`. Separate from the REST API bearer token. Optional if a SQLi username is saved on the connected account; this value takes precedence.",
      optional: true,
    },
    password: {
      type: "string",
      label: "SQLi Password",
      description: "Password for SQLi authentication, paired with **SQLi Username**. Optional if a SQLi password is saved on the connected account; this value takes precedence.",
      secret: true,
      optional: true,
    },
    port: {
      type: "integer",
      label: "SQLi Port",
      description: "Port to connect to for SQLi, e.g. `5812`. Optional — takes precedence over a port saved on the connected account, and over the port returned by Incorta's `/configs/sqlConnection` endpoint.",
      optional: true,
    },
    // --- REST discovery props (list-tables / list-columns) ---
    schemaName: {
      type: "string",
      label: "Schema Name",
      description: "Name of an Incorta schema (a logical grouping of tables/views), e.g. `pipedream_store`. Corresponds to the `schemaName` field returned by **List Schemas**.",
      optional: true,
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "Name of a table or view inside the given schema, e.g. `customer`. Corresponds to the `tableName` field returned by **List Tables**.",
    },
  },
  methods: {
    ...sqlProxy.methods,
    ...sqlProp.methods,
    _baseUrl() {
      const base = this.$auth.base_url.replace(/^https?:\/\//, "");
      return `https://${base}/incorta/api/v2/${this.$auth.tenant}`;
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${this.$auth.token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._headers(),
          ...headers,
        },
        ...opts,
      });
    },
    /**
     * Lists the schemas (physical and/or business) in the tenant via the
     * REST v2 `/schema/list` endpoint. Auto-paginates: the endpoint caps at
     * 200 schemas per request and reports `total`, so this loops on `offset`
     * until every schema has been fetched instead of silently truncating.
     * https://docs.incorta.com/latest/references-api-list-schemas-endpoint-v2
     */
    async listSchemas({
      schemaType = "ALL", sortBy, ...opts
    } = {}) {
      const limit = 200;
      let offset = 0;
      let total = Infinity;
      const schemas = [];
      while (offset < total) {
        const response = await this._makeRequest({
          method: "POST",
          path: `/schema/list?schemaType=${schemaType}`,
          data: {
            limit,
            offset,
            ...(sortBy && {
              sortBy,
            }),
          },
          ...opts,
        });
        schemas.push(...(response.schemasDetails ?? []));
        total = response.total ?? schemas.length;
        offset += limit;
      }
      return schemas;
    },
    /**
     * Lists the tables (physical schema) or views (business schema) in a
     * given schema via the REST v2 `/schema/{schemaName}/list` endpoint.
     * Auto-paginates the same way as `listSchemas()`.
     * https://docs.incorta.com/latest/references-api-list-schema-objects-endpoint-v2
     */
    async listSchemaObjects({
      schemaName, ...opts
    } = {}) {
      const limit = 200;
      let offset = 0;
      let total = Infinity;
      const objects = [];
      while (offset < total) {
        const response = await this._makeRequest({
          method: "POST",
          path: `/schema/${schemaName}/list`,
          data: {
            limit,
            offset,
          },
          ...opts,
        });
        objects.push(
          ...(response.tablesDetails ?? []),
          ...(response.viewsDetails ?? []),
        );
        total = response.total ?? objects.length;
        offset += limit;
      }
      return objects;
    },
    // --- SQLi (Postgres wire protocol) ---
    /**
     * Resolves the SQLi host/port for this tenant via the REST v2
     * `/configs/sqlConnection` endpoint. Response is plain text in
     * `host:port` form (e.g. `cluster1.sqli.incortacloud.com:15926`) — this
     * is per-cluster and not derivable from the REST base URL, so it must be
     * looked up rather than guessed.
     * https://docs.incorta.com/latest/references-api-get-sql-connection-endpoint-v2
     */
    async getSqliConnection() {
      // Bypasses _makeRequest()/_headers(): this endpoint 500s if an
      // `Accept` header is present (confirmed against a live tenant), unlike
      // every other v2 endpoint here, so it can't reuse the shared headers.
      const response = await axios(this, {
        url: `${this._baseUrl()}/configs/sqlConnection`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.token}`,
        },
      });
      const raw = (typeof response === "string"
        ? response
        : String(response)).trim();
      const separatorIndex = raw.lastIndexOf(":");
      const host = separatorIndex === -1
        ? raw
        : raw.slice(0, separatorIndex);
      const parsedPort = separatorIndex === -1
        ? NaN
        : Number(raw.slice(separatorIndex + 1));
      // Precedence: `port` prop, then `$auth.port`, then the endpoint's port
      // (which can come back as `undefined`, so it's only required when
      // neither override is set).
      const override = this.port ?? this.$auth.port;
      const port = override == null
        ? parsedPort
        : Number(override);
      const isValidPort = Number.isInteger(port) && port >= 1 && port <= 65535;
      if (override != null && !isValidPort) {
        throw new ConfigurationError(`Invalid SQLi port \`${override}\`. Enter an integer between 1 and 65535.`);
      }
      if (!host || !isValidPort) {
        throw new ConfigurationError(`Incorta returned an incomplete SQLi connection string (\`${raw}\`). SQLi may not be enabled or fully configured for this tenant — check with your Incorta administrator.`);
      }
      return {
        host,
        port,
      };
    },
    /**
     * A helper method to get the configuration object that's directly fed to
     * the PostgreSQL client constructor. `host`/`port` come from
     * `getSqliConnection()`, `database` is the tenant from `$auth`, and
     * `username`/`password` come from `this.username`/`this.password` if
     * set, otherwise `$auth.username`/`$auth.password` — the props are
     * populated because the calling action copies its own props onto
     * `this.incorta` first (`this` is bound to this app object, not the
     * calling action, when invoked as `this.incorta.getClientConfiguration()`)
     * — see `execute-sql-query.mjs`.
     */
    async getClientConfiguration() {
      const user = this.username ?? this.$auth.username;
      const password = this.password ?? this.$auth.password;
      if (!user || !password) {
        throw new ConfigurationError("SQLi username and password are required. Provide them as props, or save them on the connected Incorta account.");
      }
      const {
        host, port,
      } = await this.getSqliConnection();
      return {
        host,
        port,
        database: this.$auth.tenant,
        user,
        password,
      };
    },
    async _getClient() {
      const config = await this.getClientConfiguration();
      const client = new pg.Client(config);
      await client.connect();
      return client;
    },
    async _endClient(client) {
      return client.end();
    },
    /**
     * Adapts the arguments to `executeQuery` so that they can be consumed by
     * the SQL proxy (when applicable).
     */
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
    /**
     * Performs the inverse transformation of `proxyAdapter`.
     */
    executeQueryAdapter(proxyArgs = {}) {
      const {
        query: text = "", params: values = [],
      } = proxyArgs;
      return {
        text,
        values,
      };
    },
    /**
     * Executes a query against Incorta via SQLi. This method takes care of
     * connecting, executing the query, and closing the connection.
     */
    async executeQuery(query) {
      const client = await this._getClient();
      try {
        const { rows } = await client.query(query);
        return rows;
      } finally {
        await this._endClient(client);
      }
    },
    /**
     * A helper method to get the schema of the tenant. Used by the `sql`
     * prop to enrich the code editor with auto-complete and field
     * suggestions. Built from the REST API (not a SQLi introspection query)
     * so it only ever depends on `this.$auth`.
     */
    async getSchema() {
      const schemas = await this.listSchemas();
      const dbInfo = {};
      for (const schema of schemas) {
        const schemaName = utils.getItemName(schema);
        const objects = await this.listSchemaObjects({
          schemaName,
        });
        for (const object of objects) {
          const tableName = utils.getItemName(object);
          const columns = object.columns ?? object.fields ?? [];
          dbInfo[`${schemaName}.${tableName}`] = {
            metadata: {},
            schema: columns.reduce((acc, col) => {
              const columnName = col.name ?? col.columnName;
              acc[columnName] = {
                dataType: col.dataType ?? col.type,
                tableSchema: schemaName,
              };
              return acc;
            }, {}),
          };
        }
      }
      return dbInfo;
    },
  },
};
