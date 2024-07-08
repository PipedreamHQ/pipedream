/* eslint-disable no-unused-vars */
/* eslint-disable pipedream/props-label */
/* eslint-disable pipedream/props-description */
import postgresql from "../../../postgresql/postgresql.app.mjs";
import mysql from "../../../mysql/mysql.app.mjs";
import snowflake from "../../../snowflake/snowflake.app.mjs";

export default {
  name: "Query SQL Database",
  key: "database-query-sql-database",
  description:
    "Execute a SQL Query. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream.",
  version: "0.0.1",
  type: "action",
  props: {
    database: {
      type: "app",
      app: "database",
    },
    db_type: {
      label: "Database Type",
      type: "string",
      description: "Select the database type you need to query",
      options: [
        {
          label: "PostgreSQL",
          value: "postgresql",
        },
        {
          label: "MySQL",
          value: "mysql",
        },
        {
          label: "Snowflake",
          value: "snowflake",
        },
      ],
      default: "postgresql",
      reloadProps: true,
    },
    postgresql: {
      ...postgresql,
      hidden: true,
    },
    mysql: {
      ...mysql,
      hidden: true,
    },
    snowflake: {
      ...snowflake,
      hidden: true,
    },
    sql: {
      type: "sql",
      auth: {
        app: "postgresql",
      },
      hidden: true,
    },
  },
  async additionalProps(prev) {
    const db_type = this.db_type?.value || this.db_type;

    prev.snowflake.hidden = db_type !== "snowflake";
    prev.mysql.hidden = db_type !== "mysql";
    prev.postgresql.hidden = db_type !== "postgresql";
    prev.sql.hidden = !db_type;

    prev.snowflake.disabled = db_type !== "snowflake";
    prev.mysql.disabled = db_type !== "mysql";
    prev.postgresql.disabled = db_type !== "postgresql";

    prev.sql.disabled = !db_type;
    prev.sql.auth.app = db_type;

    return {
      sql: {
        type: "sql",
        auth: {
          app: db_type,
        },
        label: "SQL Query",
      },
    };
  },
  async run({
    steps, $,
  }) {
    const db_type = this.db_type.value || this.db_type;
    const args = this[db_type].executeQueryAdapter(this.sql);
    const data = await this[db_type].executeQuery(args);
    $.export(
      "$summary",
      `Returned ${data.length} ${data.length === 1
        ? "row"
        : "rows"}`,
    );
    return data;
  },
};
