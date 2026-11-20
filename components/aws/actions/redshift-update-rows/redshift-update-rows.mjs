import app from "../../aws.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  parseJson, toSingleLineString,
} from "../../common/utils.mjs";

// New column values are bound as `pd_set_<column>`, a prefix a caller's own
// `sqlParameters` are unlikely to use, so they can't replace a `where` parameter
const SET_PREFIX = "pd_set_";

export default {
  key: "aws-redshift-update-rows",
  name: "Redshift - Update Rows",
  description: toSingleLineString(`
    Changes column values on every row of a Redshift table that matches \`where\`. Use it to correct or modify existing rows; use **Redshift - Create Rows** to add new ones.
    The change can't be undone, and a \`where\` that matches too much updates all of it. Preview the affected rows first with **Redshift - Query Database**, using the same \`where\` and \`sqlParameters\`:
    it returns only 10 rows by default and reports more through \`truncated\`, so check \`truncated\` (raise \`limit\`, or pass \`columns\` \`["COUNT(*)"]\` to count) to see everything the update would change.
    Find the \`schema\` and \`table\` with **Redshift - List Schemas** and **Redshift - List Tables**; run **Redshift - List Workgroups** and **Redshift - List Databases** before those.
    Put each column to change and its new value in \`updates\`; every value is sent as text and Redshift casts it to the column's type.
    The call waits for Redshift to finish, so it takes at least a few seconds. It returns the statement's \`Status\` and \`ResultRows\`, the number of rows updated (0 means \`where\` matched nothing).
    Example: \`schema\` \`public\`, \`table\` \`orders\`, \`updates\` \`{ "status": "shipped" }\`, \`where\` \`id = :id\`, \`sqlParameters\` \`{ "id": 42 }\` returns
    \`{ "Id": "b2c4-92", "Status": "FINISHED", "HasResultSet": false, "ResultRows": 1 }\`.
    [See the documentation](https://docs.aws.amazon.com/redshift-data/latest/APIReference/API_ExecuteStatement.html)
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
      .map((key) => `${key} = :${SET_PREFIX}${key}`)
      .join(", ");

    const sql = `UPDATE ${schema}.${table} SET ${setClause} WHERE ${where}`;

    const updateParameters = Object.entries(parseJson(updates) || {})
      .map(([
        name,
        value,
      ]) => ({
        name: `${SET_PREFIX}${name}`,
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

    const taken = new Set(updateParameters.map(({ name }) => name));
    const clash = whereParameters.find(({ name }) => taken.has(name));
    if (clash) {
      throw new ConfigurationError(`The parameter name \`${clash.name}\` in \`sqlParameters\` is reserved for a column being updated. Use a different name.`);
    }

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
