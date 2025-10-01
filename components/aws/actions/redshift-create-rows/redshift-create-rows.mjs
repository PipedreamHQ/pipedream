import { ConfigurationError } from "@pipedream/platform";
import app from "../../aws.app.mjs";
import { parseArray } from "../../common/utils.mjs";

export default {
  key: "aws-redshift-create-rows",
  name: "Redshift - Create Rows",
  description: "Insert rows into a table. [See the documentation](https://docs.aws.amazon.com/redshift/latest/APIReference/API_ExecuteStatement.html)",
  type: "action",
  version: "0.0.2",
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
