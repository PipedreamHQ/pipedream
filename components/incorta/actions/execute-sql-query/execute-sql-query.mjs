import incorta from "../../incorta.app.mjs";

export default {
  key: "incorta-execute-sql-query",
  name: "Execute SQL Query",
  description: "Executes a custom Spark SQL query against an Incorta tenant via the **Advanced SQL Interface** (Advanced SQLi), which exposes the tenant's physical schemas and verified business views as Spark SQL tables."
    + " Use this for ad hoc reporting or data exploration. It is a read/query interface (not a general-purpose transactional database) — expect `SELECT` statements with Spark SQL syntax: joins, aggregates, `GROUP BY`, window functions, and CTEs all work."
    + " Use **List Schemas**, **List Tables**, and **List Columns** first if you don't already know the available schema/table/column names, and reference tables as `schema.table`, e.g. `pipedream_store.customer`."
    + " Always include a `LIMIT` (and select only the columns you need) for exploratory queries: results are capped at **Max Rows** (default 500), and the response reports `truncated: true` when more rows existed than were returned, so a truncated result is partial (the total row count is not known; run a `COUNT(*)` if you need it). Narrow the query with `LIMIT`, filters, or aggregates rather than relying on the cap."
    + " To read the next page of a large result, either use `LIMIT n OFFSET m` with a stable `ORDER BY`, or keyset paging (`ORDER BY <unique column>` and `WHERE <column> > <last value seen>` with `LIMIT`), e.g. `SELECT * FROM sales.orders WHERE order_id > 1000 ORDER BY order_id LIMIT 100`; keyset paging is faster on large tables."
    + " Example: `SELECT region, SUM(amount) AS total_sales FROM sales.sales_fact GROUP BY region ORDER BY total_sales DESC LIMIT 50` returns `{rows: [{region, total_sales}, ...], rowCount, truncated: false}`, one row per region."
    + " Authenticates with the connected Incorta account's username and personal access token (PAT), so no separate SQL password is needed, and discovers the cluster's Advanced SQLi connection settings automatically from the account's base URL; the tenant must have Advanced SQLi enabled (not available on Azure deployments). The first query after a quiet period can take several seconds while the connection initializes."
    + " [See the documentation](https://docs.incorta.com/latest/references-advanced-sqli)",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    incorta,
    sql: {
      type: "sql",
      auth: {
        app: "incorta",
      },
      label: "SQL Query",
      description: "The Spark SQL query to execute against Incorta via Advanced SQLi, e.g. `SELECT * FROM sales.sales_fact LIMIT 50`. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream",
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
