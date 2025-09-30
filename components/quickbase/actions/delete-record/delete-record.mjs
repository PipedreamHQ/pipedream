import common from "../common/record.mjs";

export default {
  ...common,
  key: "quickbase-delete-record",
  name: "Delete Record",
  description: "Deletes a record in a Quick Base table. [See the documentation](https://developer.quickbase.com/operation/deleteRecords)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    tableId: {
      propDefinition: [
        common.props.quickbase,
        "tableId",
        (c) => ({
          appId: c.appId,
        }),
      ],
    },
    recordId: {
      propDefinition: [
        common.props.quickbase,
        "recordId",
        (c) => ({
          appId: c.appId,
          tableId: c.tableId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const keyFieldId = await this.getKeyFieldId(this.appId, this.tableId);
    const response = await this.quickbase.deleteRecord({
      $,
      data: {
        from: this.tableId,
        where: `{${keyFieldId}.EX.${this.recordId}}`,
      },
    });
    $.export("$summary", `Successfully deleted record ${this.recordId}`);
    return response;
  },
};
