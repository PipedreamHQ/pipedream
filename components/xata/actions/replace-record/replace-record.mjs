import app from "../../xata.app.mjs";

export default {
  key: "xata-replace-record",
  name: "Replace Record",
  description: "Replace a record with the specified ID. [See the documentation](https://xata.io/docs/api-reference/db/db_branch_name/tables/table_name/data/record_id#insert-record-with-id)",
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
    recordId: {
      propDefinition: [
        app,
        "recordId",
        (c) => ({
          endpoint: c.endpoint,
          database: c.database,
          table: c.table,
          branch: c.branch,
        }),
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
    const response = await this.app.replaceRecord({
      $,
      endpoint: this.endpoint,
      database: this.database,
      branch: this.branch,
      table: this.table,
      recordId: this.recordId,
      data: this.recordData,
    });
    $.export("$summary", `Successfully replaced Record with ID: '${response.id}'`);
    return response;
  },
};
