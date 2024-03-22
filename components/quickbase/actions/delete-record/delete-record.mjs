import quickbase from "../../quickbase.app.mjs";

export default {
  key: "quickbase-delete-record",
  name: "Delete Record",
  description: "Deletes a record in a Quick Base table. [See the documentation](https://developer.quickbase.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    quickbase,
    tableId: {
      propDefinition: [
        quickbase,
        "tableId",
      ],
    },
    recordId: {
      propDefinition: [
        quickbase,
        "recordId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.quickbase.deleteRecord({
      tableId: this.tableId,
      recordId: this.recordId,
    });
    $.export("$summary", `Successfully deleted record ${this.recordId}`);
    return response;
  },
};
