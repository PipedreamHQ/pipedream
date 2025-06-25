import app from "../../aws.app.mjs";

export default {
  key: "aws-redshift-query-database",
  name: "Redshift - Query Database",
  description: "Run a SELECT query on a database. [See the documentation](https://docs.aws.amazon.com/redshift/latest/APIReference/API_ExecuteStatement.html)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
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
      description: "List of columns to retrieve.",
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
      description: "Maximum number of rows to return.",
      optional: true,
      default: 10,
    },
    sqlParameters: {
      type: "object",
      label: "Parameters",
      description: "An object with parameters to use in the WHERE clause. e.g. `{ \"id\": 1 }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      region,
      workgroupName,
      database,
      columns,
      from,
      where,
      sqlParameters,
      orderBy,
      limit,
    } = this;

    const effectiveColumns = Array.isArray(columns) && columns.length
      ? columns.join(", ")
      : "*";

    let sql = `SELECT ${effectiveColumns} FROM ${from}`;

    if (where) {
      sql += ` WHERE ${where}`;
    }
    if (orderBy) {
      sql += ` ORDER BY ${orderBy}`;
    }
    if (limit) {
      sql += " LIMIT :limit";
    }
    const parameters = Object.entries({
      ...sqlParameters,
      limit,
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
    });
    $.export("$summary", `Successfully found \`${response.TotalNumRows}\` row(s).`);
    return response;
  },
};
