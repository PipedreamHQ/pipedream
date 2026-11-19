import { ConfigurationError } from "@pipedream/platform";
import app from "../../aws.app.mjs";
import {
  parseArray, toSingleLineString,
} from "../../common/utils.mjs";

export default {
  key: "aws-redshift-create-rows",
  name: "Redshift - Create Rows",
  description: toSingleLineString(`
    Inserts one or more new rows into a Redshift table with a single \`INSERT\`. Use it to add data; it never changes existing rows.
    Redshift doesn't enforce unique or primary keys, so inserting the same row twice creates two copies: check with **Redshift - Query Database** first if duplicates matter.
    Find the \`schema\` and \`table\` with **Redshift - List Schemas** and **Redshift - List Tables**; run **Redshift - List Workgroups** and **Redshift - List Databases** before those.
    List the columns once in \`columns\`, then give each row's values in the same order in \`rows\`. Every value is sent as text and Redshift casts it to the column's type.
    The call waits for Redshift to finish, so it takes at least a few seconds. It returns the statement's \`Status\` and \`ResultRows\`, the number of rows inserted.
    Example: \`schema\` \`public\`, \`table\` \`orders\`, \`columns\` \`["id", "status"]\`, \`rows\` \`[[1, "open"], [2, "paid"]]\` returns
    \`{ "Id": "b2c4-91", "Status": "FINISHED", "HasResultSet": false, "ResultRows": 2 }\`.
    [See the documentation](https://docs.aws.amazon.com/redshift/latest/APIReference/API_ExecuteStatement.html)
  `),
  type: "action",
  ai: "optimized",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
          region, workgroupName,
        }) => ({
          region,
          workgroupName,
        }),
      ],
    },
    schema: {
      propDefinition: [
        app,
        "schema",
        ({
          region, database, workgroupName,
        }) => ({
          region,
          database,
          workgroupName,
        }),
      ],
    },
    table: {
      propDefinition: [
        app,
        "table",
        ({
          region, workgroupName, database, schema,
        }) => ({
          region,
          workgroupName,
          database,
          schema,
        }),
      ],
    },
    columns: {
      type: "string[]",
      label: "Columns",
      description: "An array of column names for the new rows (e.g., `[\"id\", \"name\"]`).",
    },
    rows: {
      type: "string[]",
      label: "Rows",
      description: "An array of data for the new rows. Each element must be a JSON array string with values corresponding to the specified columns (e.g., `[[1, \"Pipedream 1\"], [2, \"Pipedream 2\"]]`).",
    },
  },
  async run({ $ }) {
    const {
      app,
      region,
      workgroupName,
      database,
      schema,
      table,
      columns: columnStrings,
      rows: rowStrings,
    } = this;

    const columns = parseArray(columnStrings);
    const rows = parseArray(rowStrings);

    if (columns.length === 0) {
      throw new ConfigurationError("The **Columns** prop must be a non-empty array.");
    }

    if (rows.length === 0) {
      throw new ConfigurationError("The **Rows** prop must be a non-empty array.");
    }

    const sql = `
      INSERT INTO ${schema}.${table} (${columns.join(", ")})
      VALUES ${rows.map((_, rowIndex) =>
    `(${columns.map((_, colIndex) => `:p${rowIndex}${colIndex}`).join(", ")})`).join(", ")}
    `;

    const parameters = rows.flatMap((row, rowIndex) => {
      if (!Array.isArray(row)) {
        throw new ConfigurationError("Please ensure that each row is an array representing the values for the columns.");
      }
      return row?.map((value, colIndex) => ({
        name: `p${rowIndex}${colIndex}`,
        value: String(value),
      }));
    });

    const response = await app.executeStatement({
      region,
      workgroupName,
      database,
      sql,
      parameters,
    });

    $.export("$summary", `Successfully created \`${response.ResultRows}\` row(s) in table \`${schema}.${table}\`.`);

    return response;
  },
};
