import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Execute SQL Query",
  key: "postgresql-execute-custom-query",
  description: "Execute a custom PostgreSQL query. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream.",
  version: "3.0.0",
  type: "action",
  props: {
    postgresql,
    // eslint-disable-next-line pipedream/props-description
    sql: {
      type: "sql",
      auth: {
        app: "postgresql",
      },
      label: "PostreSQL Query",
    },
  },
  async run() {
    const data = await this.postgresql.executeQuery({
      text: this.sql.query,
      values: this.sql.values,
    });
    console.table(data);
    return data;
  },
};
