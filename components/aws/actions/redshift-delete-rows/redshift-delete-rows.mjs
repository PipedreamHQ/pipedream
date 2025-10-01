import app from "../../aws.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "aws-redshift-delete-rows",
  name: "Redshift - Delete Rows",
  description: "Deletes row(s) in an existing table in Redshift. [See the documentation](https://docs.aws.amazon.com/redshift/latest/APIReference/API_ExecuteStatement.html)",
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
    where: {
      type: "string",
      label: "WHERE Clause",
      description: "The WHERE clause to filter rows to delete. e.g. `id = :id`. Use named parameters to avoid SQL injection.",
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
      where,
      sqlParameters,
    } = this;

    const sql = `DELETE FROM ${schema}.${table} WHERE ${where}`;

    const parameters = Object.entries(parseJson(sqlParameters) || {})
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

    $.export("$summary", `Successfully deleted \`${response.ResultRows}\` row(s) from table \`${schema}.${table}\`.`);
    return response;
  },
};
