import mssql from "mssql";
import { ConfigurationError } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "microsoft_sql_server",
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
    exportSummary(step) {
      if (!step?.export) {
        throw new ConfigurationError("The summary method should be bind to the step object aka `$`");
      }
      return (msg = "") => step.export(constants.SUMMARY_LABEL, msg);
    },
    getConfig() {
      const {
        host, port, username, password, database, encrypt, trustServerCertificate,
      } = this.$auth;
      return {
        user: username,
        password,
        database,
        server: host,
        port: Number(port),
        options: {
          // for azure
          encrypt: String(encrypt).toLowerCase() === "true",
          // true for local dev / self-signed certs
          trustServerCertificate: String(trustServerCertificate).toLowerCase() === "true",
        },
      };
    },
    getConnection() {
      return mssql.connect(this.getConfig());
    },
    async executeQuery({
      step = this, summary, query = "", inputs = {},
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
          this.exportSummary(step)(summary(response));
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
      table, column, page = 1, limit = constants.DEFAULT_LIMIT, ...args
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
      max = constants.DEFAULT_MAX,
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
    paginate(args = {}) {
      const stream = this.getResourcesStream(args);
      return utils.streamIterator(stream);
    },
  },
};
