import app from "../../aws.app.mjs";

export default {
  key: "aws-redshift-delete-rows",
  name: "Redshift - Delete Rows",
  description: "Deletes row(s) in an existing table in Redshift. [See the documentation](https://docs.aws.amazon.com/redshift/latest/APIReference/API_ExecuteStatement.html)",
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
      type: "object",
      label: "Parameters for WHERE clause",
      description: "An object with parameters to use in the WHERE clause. e.g. `{ \"id\": 1 }`",
      optional: true,
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

    const parameters = Object.entries(sqlParameters || {})
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
