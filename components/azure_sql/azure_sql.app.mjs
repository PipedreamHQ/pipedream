import sql from "mssql";

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
    exportSummary($) {
      return (msg = "") => $.export("$summary", msg);
    },
    getConfig() {
      const {
        host, username, password, port, database, encrypt,
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
          encrypt: String(encrypt).toLowerCase() === "true",
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
        SELECT t.table_schema AS tableSchema,
            t.table_name AS tableName,
            CAST(t.table_rows AS UNSIGNED) AS rowCount,
            c.column_name AS columnName,
            c.data_type AS dataType,
            c.is_nullable AS isNullable,
            c.column_default AS columnDefault
        FROM information_schema.tables AS t
            JOIN information_schema.columns AS c ON t.table_name = c.table_name
            AND t.table_schema = c.table_schema
        WHERE t.table_schema = ?
        ORDER BY t.table_name,
            c.ordinal_position
      `;
      const rows = await this.executeQuery({
        query: sql,
      });
      return rows.reduce((acc, row) => {
        acc[row.tableName] ??= {
          metadata: {
            rowCount: row.rowCount,
          },
          schema: {},
        };
        acc[row.tableName].schema[row.columnName] = {
          ...row,
        };
        return acc;
      }, {});
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
      const {
        query = "",
        params: inputs = [],
      } = proxyArgs;
      return {
        query,
        inputs,
      };
    },
    async executeQuery({
      $ = this, summary, query = "", inputs = {},
    } = {}) {
      let connection;

      try {
        connection = await this.getConnection();

        const input =
          Object.entries(inputs)
            .reduce((req, inputArgs) =>
              req.input(...inputArgs), connection.request());

        const response = await input.query(query);

        if (typeof summary === "function") {
          this.exportSummary($)(summary(response));
        }

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
