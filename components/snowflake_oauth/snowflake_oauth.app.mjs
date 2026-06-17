import common from "@pipedream/snowflake";
import { ConfigurationError } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  ...common,
  app: "snowflake_oauth",
  propDefinitions: {
    database: {
      type: "string",
      label: "Database",
      description: "The database to use. Run the **List Databases** action first to find available database names, then paste a name here.",
      optional: true,
    },
    schema: {
      type: "string",
      label: "Schema",
      description: "The schema to use. Run the **List Schemas** action (with your chosen database) first to find available schema names, then paste a name here.",
      optional: true,
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The fully-qualified table name in `database.schema.table` form. Run the **List Tables** action (with your chosen database and schema) first, then paste the value here.",
      optional: true,
    },
    columns: {
      type: "string[]",
      label: "Columns",
      description: "The columns you want to insert data into. Run the **List Columns** action (with your fully-qualified table name) first, then enter them here.",
      optional: true,
    },
    values: {
      type: "string",
      label: "Row Values",
      description: "**Provide an array of arrays**. Each nested array represents a row, with each element a value (e.g. `[[\"Foo\",1,2],[\"Bar\",3,4]]` inserts two rows of three columns each). Commonly references a previous step export (e.g. `{{steps.foo.$return_value}}`). May also be a string that JSON.parse()s to an array of arrays.",
    },
    emitIndividualEvents: {
      type: "boolean",
      label: "Emit individual events",
      description: "Defaults to `true`, triggering workflows on each record in the result set. Set to `false` to emit records in batch (advanced).",
      optional: true,
      default: true,
    },
    warehouses: {
      type: "string[]",
      label: "Warehouse Name",
      description: "**Optional**. The warehouse name(s) to watch. Run the **List Warehouses** action first. If not provided, all accessible warehouses are used.",
      optional: true,
    },
    users: {
      type: "string[]",
      label: "User Name",
      description: "**Optional**. The user name(s) to watch. Run the **List Users** action first. If not provided, all accessible users are used.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    /**
     * Reuse the entire key-based Snowflake engine from @pipedream/snowflake and
     * override ONLY the auth: this OAuth variant collects a full account URL and
     * an OAuth access token instead of account/username/private-key.
     */
    getClientConfiguration() {
      const {
        snowflake_account_url: accountUrl,
        oauth_access_token: token,
      } = this.$auth;
      // The OAuth app collects a full account URL (e.g. https://<account>.snowflakecomputing.com),
      // not a bare account identifier. Derive the account locator the SDK expects from it.
      const account = new URL(accountUrl).hostname.replace(".snowflakecomputing.com", "");
      return {
        account,
        authenticator: "OAUTH",
        token,
        application: "PIPEDREAM_PIPEDREAM",
      };
    },
    /**
     * Guard an identifier (database, schema, table, column) that must be
     * interpolated into SQL because it cannot be passed as a bind. Throws a
     * ConfigurationError on anything outside the safe identifier pattern.
     */
    _validateIdentifier(identifier) {
      const value = `${identifier}`;
      if (!constants.IDENTIFIER_REGEX.test(value)) {
        throw new ConfigurationError(`Invalid Snowflake identifier: \`${value}\``);
      }
      return value;
    },
    async listTables({
      database, schema,
    }) {
      this._validateIdentifier(database);
      this._validateIdentifier(schema);
      const sqlText = `SHOW TABLES IN SCHEMA ${database}.${schema}`;
      return this.executeQuery({
        sqlText,
      });
    },
    async insertRow(tableName, values) {
      this._validateIdentifier(tableName);
      const columns = Object.keys(values);
      columns.forEach((column) => this._validateIdentifier(column));
      const binds = Object.values(values);
      const sqlText = `INSERT INTO ${tableName} (${columns.join(",")}) VALUES (${columns.map(() => "?").join(", ")});`;
      const statement = {
        sqlText,
        binds,
      };
      return this.executeQuery(statement);
    },
    async _insertRowsOriginal(tableName, columns, values) {
      this._validateIdentifier(tableName);
      columns.forEach((column) => this._validateIdentifier(column));
      const rowPlaceholders = values.map(() =>
        `(${columns.map(() => "?").join(", ")})`).join(", ");
      const sqlText = `INSERT INTO ${tableName} (${columns.join(",")}) VALUES ${rowPlaceholders}`;
      const binds = values.flat();
      const statement = {
        sqlText,
        binds,
      };
      return this.executeQuery(statement);
    },
  },
};
