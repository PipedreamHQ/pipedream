import sql from "mssql";
import {
  sqlProxy,
  sqlProp,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "azure_sql",
  propDefinitions: {
    table: {
      type: "string",
      label: "Table",
      description: "The database table to watch for changes",
      async options() {
        const { recordset } = await this.listTables();
        return recordset.map(({ TABLE_NAME: columnName }) => columnName);
      },
    },
    column: {
      type: "string",
      label: "Column",
      description: "The name of a column in the table.",
      async options({ table }) {
        const { recordset } = await this.listColumns({
          table,
        });
        return recordset.map(({ COLUMN_NAME: columnName }) => columnName);
      },
    },
  },
  methods: {
    ...sqlProxy.methods,
    ...sqlProp.methods,
    exportSummary($) {
      return (msg = "") => $.export("$summary", msg);
    },
    getConfig() {
      const {
        host, username, password, port, database,
      } = this.$auth;
      return {
        user: username,
        password,
        server: host,
        port: Number(port),
        database,
        authentication: {
          type: "default",
        },
        options: {
          encrypt: true,
          port: Number(port),
        },
      };
    },
    getConnection() {
      return sql.connect(this.getConfig());
    },
    /**
     * A helper method to get the schema of the database. Used by other features
     * (like the `sql` prop) to enrich the code editor and provide the user with
     * auto-complete and fields suggestion.
     *
     * @returns {DbInfo} The schema of the database, which is a
     * JSON-serializable object.
     */
    async getSchema() {
      const sql = `
        SELECT t.TABLE_SCHEMA AS tableSchema,
            t.TABLE_NAME AS tableName,
            c.COLUMN_NAME AS columnName,
            c.DATA_TYPE AS dataType,
            c.IS_NULLABLE AS isNullable,
            c.COLUMN_DEFAULT AS columnDefault
        FROM INFORMATION_SCHEMA.TABLES AS t
            JOIN INFORMATION_SCHEMA.COLUMNS AS c ON t.TABLE_NAME = c.TABLE_NAME
            AND t.TABLE_SCHEMA = c.TABLE_SCHEMA
        WHERE t.TABLE_TYPE = 'BASE TABLE'
        ORDER BY t.TABLE_NAME,
            c.ORDINAL_POSITION
      `;
      const { recordset: rows } = await this.executeQuery({
        query: sql,
      });
      return rows.reduce((acc, row) => {
        const key = `${row.tableSchema}.${row.tableName}`;
        acc[key] ??= {
          metadata: {
            rowCount: row.rowCount,
          },
          schema: {},
        };
        acc[key].schema[row.columnName] = {
          ...row,
        };
        return acc;
      }, {});
    },
    /**
     * Adapts the arguments to `executeQuery` so that they can be consumed by
     * the SQL proxy (when applicable). Note that this method is not intended to
     * be used by the component directly.
     * @param {object} preparedStatement The prepared statement to be sent to the DB.
     * @param {string} preparedStatement.sql The prepared SQL query to be executed.
     * @param {string[]} preparedStatement.values The values to replace in the SQL query.
     * @returns {object} - The adapted query and parameters.
     */
    proxyAdapter(preparedStatement = {}) {
      const { query } = preparedStatement;
      const inputs = preparedStatement?.inputs || {};
      for (const [
        key,
        value,
      ] of Object.entries(inputs)) {
        query.replaceAll(`@${key}`, value);
      }
      return {
        query,
        params: [],
      };
    },
    /**
     * A method that performs the inverse transformation of `proxyAdapter`.
     *
     * @param {object} proxyArgs - The output of `proxyAdapter`.
     * @param {string} proxyArgs.query - The SQL query to be executed.
     * @param {string[]} proxyArgs.params - The values to replace in the SQL
     * query.
     * @returns {object} - The adapted query and parameters, compatible with
     * `executeQuery`.
     */
    executeQueryAdapter(proxyArgs = {}) {
      let { query } = proxyArgs;
      const params = proxyArgs?.params || [];
      for (const param of params) {
        query = query.replace("?", param);
      }
      query = query.replaceAll("\n", " ");
      return {
        query,
        inputs: {},
      };
    },
    getClientConfiguration() {
      return this.getConfig();
    },
    async executeQuery(preparedStatement = {}) {
      let connection;
      const { query } = preparedStatement;
      const inputs = preparedStatement?.inputs || {};
      try {
        connection = await sql.connect(this.getClientConfiguration());
        const input =
          Object.entries(inputs)
            .reduce((req, inputArgs) =>
              req.input(...inputArgs), connection.request());
        const response = await input.query(query);

        return response;

      } catch (error) {
        console.log("Error executing query", error);
        throw error;

      } finally {
        if (connection) {
          await connection.close();
        }
      }
    },
    listTables(args = {}) {
      const query = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'";
      return this.executeQuery({
        query,
        ...args,
      });
    },
    listColumns({
      table, ...args
    } = {}) {
      const query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @table";
      return this.executeQuery({
        query,
        inputs: {
          table,
        },
        ...args,
      });
    },
    insertRow({
      table, inputs = {}, ...args
    } = {}) {
      const columns = Object.keys(inputs);
      const values = columns.map((key) => `@${key}`).join(", ");
      const query = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${values})`;
      return this.executeQuery({
        query,
        inputs,
        ...args,
      });
    },
    listNewColumns({
      table, columns = [], ...args
    } = {}) {
      const whereColumns =
        columns.length
          ? `AND COLUMN_NAME NOT IN (${columns.map((c) => `'${c}'`)})`
          : "";
      const query = `
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_NAME = @table ${whereColumns}
      `;
      return this.executeQuery({
        query,
        inputs: {
          table,
        },
        ...args,
      });
    },
    listResources({
      table, column, page = 1, limit = 60, ...args
    } = {}) {
      return this.executeQuery({
        query: `
          SELECT * FROM (
            SELECT ROW_NUMBER() OVER (ORDER BY @column) AS pdId, * FROM ${table}
          ) AS subQuery
            WHERE pdId
              BETWEEN ((@page - 1) * @limit + 1)
              AND (@page * @limit)
        `,
        inputs: {
          column,
          page,
          limit,
        },
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = 600,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response = await resourceFn({
          ...resourceFnArgs,
          page,
        });

        const nextResources = resourceName && response[resourceName] || response;

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        page += 1;
      }
    },
    async streamIterator(stream) {
      const resources = [];
      for await (const resource of stream) {
        resources.push(resource);
      }
      return resources;
    },
    paginate(args = {}) {
      const stream = this.getResourcesStream(args);
      return this.streamIterator(stream);
    },
  },
};
