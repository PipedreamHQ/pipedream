import app from "../../aws.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "aws-redshift-update-rows",
  name: "Redshift - Update Rows",
  description: "Update row(s) in an existing table in Redshift. [See the documentation](https://docs.aws.amazon.com/redshift/latest/APIReference/API_ExecuteStatement.html)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
          region,
          workgroupName,
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
          region,
          database,
          workgroupName,
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
          region,
          database,
          workgroupName,
          schema,
        }) => ({
          region,
          database,
          workgroupName,
          schema,
        }),
      ],
    },
    updates: {
      type: "object",
      label: "Updates",
      description: "An object of key-value pairs to update. Keys are column names. e.g. `{\"col1\": \"new_val\"}`",
    },
    where: {
      type: "string",
      label: "WHERE Clause",
      description: "The WHERE clause to filter rows to update. e.g. `id = :id`. Use named parameters to avoid SQL injection.",
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
      schema,
      table,
      updates,
      where,
      sqlParameters,
    } = this;

    const setClause = Object.keys(updates)
      .map((key) => `${key} = :set_${key}`)
      .join(", ");

    const sql = `UPDATE ${schema}.${table} SET ${setClause} WHERE ${where}`;

    const updateParameters = Object.entries(parseJson(updates) || {})
      .map(([
        name,
        value,
      ]) => ({
        name: `set_${name}`,
        value: String(value),
      }));

    const whereParameters = Object.entries(parseJson(sqlParameters) || {})
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
      parameters: [
        ...updateParameters,
        ...whereParameters,
      ],
    });

    $.export("$summary", `Successfully updated \`${response.ResultRows}\` row(s) in table \`${schema}.${table}\`.`);
    return response;
  },
};
