import app from "../../xata.app.mjs";

export default {
  key: "xata-create-record",
  name: "Create Record",
  description: "Create a new Record in the specified database. [See the documentation](https://xata.io/docs/api-reference/db/db_branch_name/tables/table_name/data#insert-record)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    endpoint: {
      propDefinition: [
        app,
        "endpoint",
      ],
    },
    workspace: {
      propDefinition: [
        app,
        "workspace",
      ],
    },
    database: {
      propDefinition: [
        app,
        "database",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
    branch: {
      propDefinition: [
        app,
        "branch",
        (c) => ({
          endpoint: c.endpoint,
          database: c.database,
        }),
      ],
    },
    table: {
      propDefinition: [
        app,
        "table",
      ],
    },
    recordData: {
      propDefinition: [
        app,
        "recordData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createRecord({
      $,
      endpoint: this.endpoint,
      database: this.database,
      branch: this.branch,
      table: this.table,
      data: this.recordData,
    });
    $.export("$summary", `Successfully created Record with ID: '${response.id}'`);
    return response;
  },
};
