import app from "../../aws.app.mjs";
import {
  parseJson, toSingleLineString,
} from "../../common/utils.mjs";

export default {
  key: "aws-redshift-delete-rows",
  name: "Redshift - Delete Rows",
  description: toSingleLineString(`
    Permanently deletes every row of a Redshift table that matches \`where\`. Use it to remove specific rows; it never drops the table itself.
    Deleted rows can't be recovered, and a \`where\` that matches too much deletes all of it. Preview the rows first with **Redshift - Query Database**, using the same \`where\` and \`sqlParameters\`.
    Find the \`schema\` and \`table\` with **Redshift - List Schemas** and **Redshift - List Tables**; run **Redshift - List Workgroups** and **Redshift - List Databases** before those.
    The call waits for Redshift to finish, so it takes at least a few seconds. It returns the statement's \`Status\` and \`ResultRows\`, the number of rows deleted (0 means \`where\` matched nothing).
    Example: \`schema\` \`public\`, \`table\` \`orders\`, \`where\` \`id = :id\`, \`sqlParameters\` \`{ "id": 42 }\` returns
    \`{ "Id": "b2c4-93", "Status": "FINISHED", "HasResultSet": false, "ResultRows": 1 }\`.
    [See the documentation](https://docs.aws.amazon.com/redshift/latest/APIReference/API_ExecuteStatement.html)
  `),
  type: "action",
  ai: "optimized",
  version: "0.0.5",
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
