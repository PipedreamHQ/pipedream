import common from "../common/common.mjs";

export default {
  ...common,
  key: "xata-replace-record",
  name: "Replace Record",
  description: "Replace a record with the specified ID. [See the documentation](https://xata.io/docs/api-reference/db/db_branch_name/tables/table_name/data/record_id#insert-record-with-id)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    recordId: {
      propDefinition: [
        common.props.app,
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
        common.props.app,
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
      data: await this.formatRecordData(),
    });
    $.export("$summary", `Successfully replaced Record with ID: '${response.id}'`);
    return response;
  },
};
