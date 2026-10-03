import incorta from "../../incorta.app.mjs";

export default {
  key: "incorta-execute-sql-query",
  name: "Execute SQL Query",
  description: "Executes a custom SQL query against an Incorta tenant via **SQLi**, Incorta's SQL Interface, which exposes the tenant as a PostgreSQL-wire-protocol database."
    + " Use this for ad hoc reporting or data exploration against Incorta's Business Schema tables and materialized views."
    + " Incorta SQLi is primarily a read/query interface (it is not a general-purpose transactional database) — expect `SELECT` statements with standard ANSI SQL: joins, aggregates, `GROUP BY`, window functions, and CTEs all work."
    + " Use **List Schemas**, **List Tables**, and **List Columns** first if you don't already know the available schema/table/column names."
    + " Parameterize values with numbered placeholders (`$1`, `$2`, ...) rather than concatenating user input into the query string."
    + " Example: `SELECT region, SUM(amount) AS total_sales FROM sales.sales_fact GROUP BY region ORDER BY total_sales DESC` returns one row per region with `region` and `total_sales` columns."
    + " Requires a SQLi Username and Password (mixed-mode authentication) — distinct from this app's REST connected account — obtained from your Incorta administrator. The SQLi host/port and tenant database are resolved automatically."
    + " [See the documentation](https://docs.incorta.com/5.1/concepts-sqli/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    incorta,
    username: {
      propDefinition: [
        incorta,
        "username",
      ],
    },
    password: {
      propDefinition: [
        incorta,
        "password",
      ],
    },
    sql: {
      type: "sql",
      auth: {
        app: "incorta",
      },
      label: "SQL Query",
      description: "The SQL query to execute against Incorta via SQLi. Use schema-qualified table names (`schema.table`) and numbered placeholders (`$1`, `$2`, ...) for parameters, e.g. `SELECT * FROM sales.sales_fact WHERE region = $1`.",
    },
  },
  async run({ $ }) {
    // `getClientConfiguration()`/`executeQuery()` run with `this` bound to
    // `this.incorta` (not this action), so the SQLi credentials (siblings of
    // `incorta` here, not part of the app prop itself) must be copied onto
    // it explicitly before calling its methods.
    Object.assign(this.incorta, {
      username: this.username,
      password: this.password,
    });

    const args = this.incorta.executeQueryAdapter(this.sql);
    const data = await this.incorta.executeQuery(args);

    $.export("$summary", `Returned ${data.length} ${data.length === 1
      ? "row"
      : "rows"}`);

    return data;
  },
};
