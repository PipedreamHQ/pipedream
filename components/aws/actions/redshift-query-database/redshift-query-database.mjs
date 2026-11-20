import { ConfigurationError } from "@pipedream/platform";
import app from "../../aws.app.mjs";
import {
  parseJson,
  parseArray,
  toSingleLineString,
} from "../../common/utils.mjs";

const MAX_ROWS = 1000;
const LIMIT_PARAMETER = "pd_row_limit";

export default {
  key: "aws-redshift-query-database",
  name: "Redshift - Query Database",
  description: toSingleLineString(`
    Runs a read-only \`SELECT\` on a Redshift Serverless database and returns the matching rows. The query is built from \`from\`, \`columns\`, \`where\`, \`orderBy\` and \`limit\`.
    Use it to read data, or to preview which rows **Redshift - Update Rows** or **Redshift - Delete Rows** would change by reusing the same \`where\`; for a preview, check \`truncated\` or count with \`columns\` \`["COUNT(*)"]\`, because only \`limit\` rows (10 by default) come back.
    Find the table for \`from\` with **Redshift - List Tables**; run **Redshift - List Workgroups**, **Redshift - List Databases** and **Redshift - List Schemas** first.
    Rows come back in \`Records\` (one array per row, each value typed like \`{ "stringValue": "open" }\` or \`{ "longValue": 1 }\`), and \`ColumnMetadata\` names the columns.
    It returns at most \`limit\` rows (default 10) and never more than ${MAX_ROWS} in one call. Check \`truncated\` first: when it is \`true\`, more rows exist than were returned, whether \`limit\` or the cap cut the result; \`TotalNumRows\` is the number of rows returned.
    There is no cursor, so read the next rows by ordering on a unique column and filtering past the last value, e.g. \`orderBy\` \`id\` with \`where\` \`id > :lastId\` and \`sqlParameters\` \`{ "lastId": 100 }\`.
    The call waits for Redshift to finish, so it takes at least a few seconds. The parameter name \`${LIMIT_PARAMETER}\` is reserved for the row limit; any other name works in \`sqlParameters\`.
    Example: \`from\` \`public.orders\`, \`columns\` \`["id", "status"]\`, \`where\` \`status = :status\`, \`sqlParameters\` \`{ "status": "open" }\`, \`limit\` 2 returns
    \`{ "TotalNumRows": 2, "truncated": false, "ColumnMetadata": [{ "name": "id" }, { "name": "status" }], "Records": [[{ "longValue": 1 }, { "stringValue": "open" }], [{ "longValue": 4 }, { "stringValue": "open" }]] }\`.
    [See the documentation](https://docs.aws.amazon.com/redshift-data/latest/APIReference/API_ExecuteStatement.html)
  `),
  type: "action",
  ai: "optimized",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    info: {
      propDefinition: [
        app,
        "info",
      ],
    },
    region: {
      propDefinition: [
        app,
        "region",
      ],
    },
    workgroupName: {
      propDefinition: [
        app,
        "workgroupName",
        ({ region }) => ({
          region,
        }),
      ],
    },
    database: {
      propDefinition: [
        app,
        "database",
        ({
          region,
          workgroupName,
        }) => ({
          region,
          workgroupName,
        }),
      ],
    },
    columns: {
      type: "string[]",
      label: "SELECT Columns Clause",
      description: "The columns to retrieve, e.g. `[\"id\", \"status\"]`. Leave empty to select every column (`*`).",
      optional: true,
    },
    from: {
      type: "string",
      label: "FROM Clause",
      description: "The FROM clause to select from. e.g. `schema_name.table_name`",
    },
    where: {
      type: "string",
      label: "WHERE Clause",
      description: "The WHERE clause to filter rows. e.g. `id = :id`. Use named parameters to avoid SQL injection.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Column to order the results by (e.g., `column_name ASC`, `column_name DESC`).",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `The maximum number of rows to return, e.g. \`50\`. Defaults to 10, and at most ${MAX_ROWS} rows come back in one call even if this is higher. Check \`truncated\` in the result.`,
      optional: true,
      default: 10,
    },
    sqlParameters: {
      propDefinition: [
        app,
        "sqlParameters",
      ],
    },
  },
  async run({ $ }) {
    const {
      region,
      workgroupName,
      database,
      columns: columnStrings,
      from,
      where,
      sqlParameters,
      orderBy,
      limit,
    } = this;

    const columns = parseArray(columnStrings);

    const effectiveColumns =
      columns?.length > 0
        ? columns.join(", ")
        : "*";

    let sql = `SELECT ${effectiveColumns} FROM ${from}`;

    if (where) {
      sql += ` WHERE ${where}`;
    }
    if (orderBy) {
      sql += ` ORDER BY ${orderBy}`;
    }
    // Ask Redshift for one row more than will be returned: if it comes back, the
    // query's own LIMIT (or the row cap) cut the result, which Redshift never
    // reports itself. The cap applies to the SQL too, so a huge `limit` can't make
    // Redshift build a result that is then discarded.
    const wanted = Math.min(Number(limit) || MAX_ROWS, MAX_ROWS);
    // The row limit is bound under a reserved name, so it can never replace a
    // parameter the caller's `where` uses (e.g. `id = :limit`)
    const userParameters = parseJson(sqlParameters) || {};
    if (LIMIT_PARAMETER in userParameters) {
      throw new ConfigurationError(`The parameter name \`${LIMIT_PARAMETER}\` is reserved for the row limit. Use a different name in \`sqlParameters\`.`);
    }
    sql += ` LIMIT :${LIMIT_PARAMETER}`;
    const parameters = Object.entries({
      ...userParameters,
      [LIMIT_PARAMETER]: wanted + 1,
    })
      .map(([
        name,
        value,
      ]) => ({
        name,
        value: String(value),
      }));

    const response = await this.app.executeStatement({
      region,
      workgroupName,
      database,
      sql,
      parameters,
      allPages: true,
      maxRows: wanted + 1,
    });
    const records = response.Records ?? [];
    const truncated = records.length > wanted;
    const rows = records.slice(0, wanted);
    $.export("$summary", truncated
      ? `Returned ${rows.length} row(s); more exist (raise limit up to ${MAX_ROWS}, or narrow the query)`
      : `Successfully found \`${rows.length}\` row(s).`);
    return {
      ...response,
      truncated,
      TotalNumRows: rows.length,
      Records: rows,
    };
  },
};
