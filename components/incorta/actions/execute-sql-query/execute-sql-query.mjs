import incorta from "../../incorta.app.mjs";

export default {
  key: "incorta-execute-sql-query",
  name: "Execute SQL Query",
  description: "Executes a custom SQL query against an Incorta tenant via **SQLi**, Incorta's SQL Interface, which exposes the tenant as a PostgreSQL-wire-protocol database."
    + " Use this for ad hoc reporting or data exploration against Incorta's Business Schema tables and materialized views."
    + " Incorta SQLi is primarily a read/query interface (it is not a general-purpose transactional database) — expect `SELECT` statements with standard ANSI SQL: joins, aggregates, `GROUP BY`, window functions, and CTEs all work."
    + " Use **List Schemas**, **List Tables**, and **List Columns** first if you don't already know the available schema/table/column names."
    + " Always include a `LIMIT` (and select only the columns you need) for exploratory queries: results are capped at **Max Rows** (default 500), and the response reports `truncated: true` when more rows existed than were returned, so a truncated result is partial (the total row count is not known; run a `COUNT(*)` if you need it). Narrow the query with `LIMIT`, filters, or aggregates rather than relying on the cap."
    + " **Do not use `OFFSET`**: Incorta SQLi silently ignores it and returns the same rows again, with no error. To read the next page of a large result, use keyset paging instead: `ORDER BY <unique column>` and `WHERE <column> > <last value seen>` with `LIMIT`, e.g. `SELECT * FROM sales.orders WHERE order_id > 1000 ORDER BY order_id LIMIT 100`."
    + " Example: `SELECT region, SUM(amount) AS total_sales FROM sales.sales_fact GROUP BY region ORDER BY total_sales DESC LIMIT 50` returns `{rows: [{region, total_sales}, ...], rowCount, truncated: false}`, one row per region."
    + " Requires a SQLi Username and Password (mixed-mode authentication, obtained from your Incorta administrator), supplied either as props or saved on the connected Incorta account; props take precedence. The SQLi host/port and tenant database are resolved automatically."
    + " [See the documentation](https://docs.incorta.com/5.1/concepts-sqli/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    port: {
      propDefinition: [
        incorta,
        "port",
      ],
    },
    sql: {
      type: "sql",
      auth: {
        app: "incorta",
      },
      label: "SQL Query",
      description: "The SQL query to execute against Incorta via SQLi, e.g. `SELECT * FROM sales.sales_fact LIMIT 50`. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream",
    },
    maxRows: {
      type: "integer",
      label: "Max Rows",
      description: "Maximum number of rows to return, e.g. `100`. The action stops reading once more rows than this have arrived and reports `truncated`. It does not change or limit the query itself, so add a `LIMIT` to the SQL as well.",
      default: 500,
      min: 1,
      optional: true,
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
      port: this.port,
    });

    const args = this.incorta.executeQueryAdapter(this.sql);
    // The query is sent untouched; reading stops once more than `maxRows`
    // rows have arrived instead of loading the whole result.
    const {
      rows, truncated,
    } = await this.incorta.executeQueryWithLimit(args, this.maxRows);

    $.export("$summary", truncated
      ? `Returned ${rows.length} rows (truncated at Max Rows ${this.maxRows}, more rows exist); add a LIMIT or narrower filters to the query`
      : `Returned ${rows.length} ${rows.length === 1
        ? "row"
        : "rows"}`);

    return {
      rows,
      rowCount: rows.length,
      truncated,
    };
  },
};
