import common from "../common/common.mjs";

export default {
  ...common,
  key: "xata-create-record",
  name: "Create Record",
  description: "Create a new Record in the specified database. [See the documentation](https://xata.io/docs/api-reference/db/db_branch_name/tables/table_name/data#insert-record)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    recordData: {
      propDefinition: [
        common.props.app,
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
      data: await this.formatRecordData(),
    });
    $.export("$summary", `Successfully created Record with ID: '${response.id}'`);
    return response;
  },
};
