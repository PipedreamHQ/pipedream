import quickbase from "../../quickbase.app.mjs";

export default {
  key: "quickbase-delete-record",
  name: "Delete Record",
  description: "Deletes a record in a Quick Base table. [See the documentation](https://developer.quickbase.com/operation/deleteRecords)",
  version: "0.0.1",
  type: "action",
  props: {
    quickbase,
    appId: {
      propDefinition: [
        quickbase,
        "appId",
      ],
    },
    tableId: {
      propDefinition: [
        quickbase,
        "tableId",
        (c) => ({
          appId: c.appId,
        }),
      ],
    },
    recordId: {
      propDefinition: [
        quickbase,
        "recordId",
        (c) => ({
          appId: c.appId,
          tableId: c.tableId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { keyFieldId } = await this.quickbase.getTable({
      tableId: this.tableId,
      params: {
        appId: this.appId,
      },
    });
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
