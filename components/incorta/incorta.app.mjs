// Pinned via the import specifier (Pipedream installs from imports, not
// package.json). Must stay on 1.0.0: 1.0.1 pulls thrift 0.23, whose ESM-only
// uuid@13 breaks require() on the runtime's Node.
import hive from "hive-driver@1.0.0";
import {
  axios, ConfigurationError, sqlProp, sqlProxy,
} from "@pipedream/platform";
import utils from "./common/utils.mjs";

const {
  HiveClient, HiveUtils, connections, auth, thrift,
} = hive;
const {
  TCLIService, TCLIService_types: TYPES,
} = thrift;

const POLL_INTERVAL_MS = 500;
const SQL_QUERY_TIMEOUT_MS = 5 * 60 * 1000;
// Per Thrift request. Generous because the first request after a quiet period
// (opening a session) can take close to a minute while Kyuubi initializes.
const REQUEST_TIMEOUT_MS = 2 * 60 * 1000;
const CANCEL_TIMEOUT_MS = 10 * 1000;
const CLEANUP_TIMEOUT_MS = 5 * 1000;

export default {
  type: "app",
  app: "incorta",
  propDefinitions: {
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
          path: `/schema/${encodeURIComponent(schemaName)}/list`,
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
    /**
     * Fetches a single page of tables/views from a schema. The endpoint
     * honors `offset`/`limit` and reports `total` (the number of objects in
     * the schema), so callers can page without reading every object.
     * Returns `{ objects, total }`.
     */
    async listSchemaObjectsPage({
      schemaName, offset = 0, limit = 200, ...opts
    } = {}) {
      const response = await this._makeRequest({
        method: "POST",
        path: `/schema/${encodeURIComponent(schemaName)}/list`,
        data: {
          limit,
          offset,
        },
        ...opts,
      });
      const objects = [
        ...(response.tablesDetails ?? []),
        ...(response.viewsDetails ?? []),
      ];
      return {
        objects,
        total: response.total ?? offset + objects.length,
      };
    },
    // --- Advanced SQLi (HiveServer2 Thrift over HTTPS) ---
    /**
     * Fetches the cluster's connection settings from Incorta Cloud's
     * `cluster_info` endpoint (the one Incorta's own UI uses; it is not part
     * of Public API v2 and needs no credentials). `cluster` is the cluster
     * name, which is the first label of the base URL's host. Returns `info`,
     * which is `{}` for an unknown cluster.
     */
    async _getClusterInfo(baseHost, cluster) {
      const response = await axios(this, {
        url: `https://${baseHost}/incorta/cloudapi/api/v1/cluster_info`,
        params: {
          cluster,
        },
      });
      return response?.info ?? {};
    },
    /**
     * Where Advanced SQLi (Incorta's Spark SQL interface, served by Kyuubi
     * over HiveServer2 Thrift/HTTP) lives, discovered from `cluster_info`:
     * `sqlxHost`, `sqlxPort` and `sqlxPath` (the Server / Port / HTTP Path
     * shown on Incorta's Tableau Advanced SQL page). None of it can be
     * derived from the REST base URL: on cloud the HTTP path carries a
     * cluster-specific routing prefix (`gc-<region>-<zone>-<N>/cliservice`)
     * and without it every request is a 404. Cloud only. SSL is on for
     * port 443.
     */
    async _sqlEndpoint() {
      const baseHost = String(this.$auth.base_url ?? "").trim()
        .replace(/^https?:\/\//i, "")
        .replace(/\/.*$/, "");
      const cluster = baseHost.split(".")[0];
      if (!cluster) {
        throw new ConfigurationError("The connected Incorta account has no base URL, so its Advanced SQLi settings can't be looked up.");
      }
      let info;
      try {
        info = await this._getClusterInfo(baseHost, cluster);
      } catch (err) {
        throw new ConfigurationError(`Could not retrieve the Advanced SQLi settings for Incorta cluster \`${cluster}\` from ${baseHost}: ${err.message ?? err}`);
      }
      // Guard against a record for some other cluster: it must be this host.
      let infoHost = "";
      try {
        infoHost = new URL(info?.clusterHost ?? "").host.toLowerCase();
      } catch (err) {
        // handled below
      }
      if (infoHost !== baseHost.toLowerCase()) {
        throw new ConfigurationError(`Could not find the Advanced SQLi settings for Incorta cluster \`${cluster}\` from the account's base URL (${baseHost}). Check that the account's base URL is the cluster's Incorta Cloud URL.`);
      }
      if (!info.sqlxHost || !info.sqlxPath) {
        throw new ConfigurationError(`Advanced SQLi doesn't appear to be enabled for Incorta cluster \`${cluster}\`. Ask your Incorta cloud administrator to turn on **Enable Advanced SQL Interface** (Cloud Admin Portal > Configurations).`);
      }
      const port = info.sqlxPort == null || info.sqlxPort === ""
        ? 443
        : Number(info.sqlxPort);
      if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new ConfigurationError(`Incorta returned an invalid Advanced SQLi port \`${info.sqlxPort}\` for cluster \`${cluster}\`.`);
      }
      return {
        host: String(info.sqlxHost).trim(),
        port,
        path: `/${String(info.sqlxPath).trim()
          .replace(/^\/+/, "")}`,
        https: port === 443,
      };
    },
    /**
     * Opens a HiveServer2 session against Advanced SQLi. The username is
     * `<username>%<tenant>` and the password is the account's PAT.
     */
    async _openSession() {
      const username = this.$auth.username;
      if (!username || !this.$auth.token) {
        throw new ConfigurationError("The connected Incorta account needs a username and a personal access token (PAT) to use Advanced SQLi. Reconnect the account with both set.");
      }
      const {
        host, port, path, https,
      } = await this._sqlEndpoint();
      const client = new HiveClient(TCLIService, TYPES);
      // hive-driver re-emits connection failures (HTTP 404, TLS, DNS, ...) as
      // an 'error' event and the pending call never settles; with no listener
      // Node throws and kills the execution. Turn the event into a rejection
      // that every driver call is raced against.
      const failure = new Promise((resolve, reject) => client.on("error", reject));
      failure.catch(() => {});
      const race = (promise) => Promise.race([
        promise,
        failure,
      ]);
      try {
        await race(client.connect({
          host,
          port,
          options: {
            path,
            https,
            // hive-driver turns certificate verification OFF whenever
            // `https` is set; force it back on.
            nodeOptions: {
              rejectUnauthorized: true,
            },
          },
        }, new connections.HttpConnection(), new auth.PlainHttpAuthentication({
          username: `${username}%${this.$auth.tenant}`,
          password: this.$auth.token,
        })));
        // Racing a promise doesn't stop the underlying request (a stalled one
        // would hold the connection open and keep the deadline checks from
        // running), and closing the client doesn't either: thrift's HTTP
        // connection has no `end()`. Instead thrift reads its `nodeOptions`
        // for every request, so a fresh AbortSignal set there before each call
        // aborts that request at its timeout (surfacing via the 'error' event).
        const transport = client.connection.getConnection();
        const guard = (call, timeoutMs = REQUEST_TIMEOUT_MS) => {
          transport.nodeOptions.signal = AbortSignal.timeout(timeoutMs);
          return race(call()).catch((err) => {
            throw this._requestError(err, timeoutMs);
          });
        };
        const session = await guard(() => client.openSession({
          client_protocol: TYPES.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10,
        }));
        return {
          client,
          session,
          guard,
        };
      } catch (err) {
        this._closeClient(client);
        throw new ConfigurationError(`Could not connect to Incorta Advanced SQLi at ${https
          ? "https"
          : "http"}://${host}:${port}${path}: ${err.message ?? err}. Check that Advanced SQLi is enabled for this tenant, and that the account's username and PAT are valid.`);
      }
    },
    /** Turns an aborted (timed-out) Thrift request into a readable error. */
    _requestError(err, timeoutMs) {
      if (err?.name === "AbortError" || err?.name === "TimeoutError" || err?.code === "ABORT_ERR") {
        return new Error(`Incorta Advanced SQLi did not respond within ${Math.round(timeoutMs / 1000)} seconds`);
      }
      return err;
    },
    _closeClient(client) {
      try {
        client.close();
      } catch (err) {
        // best effort
      }
    },
    /**
     * Polls the operation until it finishes (hive-driver's own
     * `waitUntilReady` polls without any delay), surfacing the server's
     * error message if the query fails.
     */
    async _waitUntilFinished(operation, guard) {
      const deadline = Date.now() + SQL_QUERY_TIMEOUT_MS;
      while (true) {
        // Each status request is aborted at the deadline at the latest, so a
        // stalled request can't keep the deadline from being enforced.
        const remaining = deadline - Date.now();
        if (remaining <= 0) {
          await guard(() => operation.cancel(), CANCEL_TIMEOUT_MS).catch(() => {});
          throw new Error(`The query did not finish within ${SQL_QUERY_TIMEOUT_MS / 60000} minutes and was cancelled`);
        }
        const status = await guard(
          () => operation.status(false),
          Math.min(REQUEST_TIMEOUT_MS, remaining),
        );
        switch (status.operationState) {
        case TYPES.TOperationState.FINISHED_STATE:
          return;
        case TYPES.TOperationState.INITIALIZED_STATE:
        case TYPES.TOperationState.PENDING_STATE:
        case TYPES.TOperationState.RUNNING_STATE:
          break;
        default:
          throw new Error(status.errorMessage || "The query failed or was cancelled");
        }
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }
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
     * Executes a query against Incorta via Advanced SQLi, reading at most
     * `maxRows` rows (default: all rows). This method takes care of
     * connecting, executing the query, and closing the connection.
     * Rows are fetched in batches until `maxRows + 1` rows have arrived (the
     * extra row only detects truncation), so at most one batch beyond
     * `maxRows` is transferred; the query text is sent untouched.
     * Returns `{ rows, truncated }`.
     */
    async executeQueryWithLimit(query, maxRows = Infinity) {
      if (query.values?.length) {
        throw new ConfigurationError("Advanced SQLi does not support bound query parameters; inline the values in the SQL text.");
      }
      const {
        client, session, guard,
      } = await this._openSession();
      try {
        const operation = await guard(() => session.executeStatement(query.text, {
          runAsync: true,
        }));
        await this._waitUntilFinished(operation, guard);
        // Server batches are capped on their side; ask for one row past the
        // limit so a full batch can't hide truncation.
        operation.setMaxRows(Math.min(maxRows + 1, 10000));
        let fetched = 0;
        while (fetched <= maxRows) {
          await guard(() => operation.fetch());
          const batch = operation.getData().at(-1);
          const size = batch
            ? this._rowSetSize(batch)
            : 0;
          if (!size) {
            break;
          }
          fetched += size;
        }
        const all = new HiveUtils(TYPES).getResult(operation)
          .getValue();
        await guard(() => operation.close(), CLEANUP_TIMEOUT_MS).catch(() => {});
        return {
          rows: all.slice(0, maxRows),
          truncated: all.length > maxRows,
        };
      } catch (err) {
        throw this._cleanSqlError(err);
      } finally {
        await guard(() => session.close(), CLEANUP_TIMEOUT_MS).catch(() => {});
        this._closeClient(client);
      }
    },
    /**
     * Kyuubi wraps the real Spark error in Java class names and query ids;
     * keep just the part that helps the caller fix their query.
     */
    _cleanSqlError(err) {
      const raw = String(err?.message ?? err);
      const marker = "Error operating ExecuteStatement: ";
      const idx = raw.lastIndexOf(marker);
      const detail = (idx === -1
        ? raw
        : raw.slice(idx + marker.length))
        .replace(/^(?:[\w$]+\.)+[\w$]*(?:Exception|Error):\s*/, "")
        .trim();
      return new Error(detail || raw);
    },
    /** Number of rows in one columnar Thrift row set. */
    _rowSetSize(rowSet) {
      const column = (rowSet.columns ?? [])[0] ?? {};
      const values = Object.values(column).find((v) => v?.values);
      return values?.values.length ?? 0;
    },
    async executeQuery(query) {
      const { rows } = await this.executeQueryWithLimit(query);
      return rows;
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
