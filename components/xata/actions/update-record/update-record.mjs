import app from "../../xata.app.mjs";

export default {
  key: "xata-update-record",
  name: "Update Record",
  description: "Update or create a record with the specified ID. [See the documentation](https://xata.io/docs/api-reference/db/db_branch_name/tables/table_name/data/record_id#upsert-record-with-id)",
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
    const response = await this.app.updateRecord({
      $,
      endpoint: this.endpoint,
      database: this.database,
      branch: this.branch,
      table: this.table,
      recordId: this.recordId,
      data: this.recordData,
    });

    $.export("$summary", `Successfully updated/created Record with ID: '${response.id}'`);

    return response;
  },
};
