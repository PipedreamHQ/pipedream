import quickbase from "../../quickbase.app.mjs";

export default {
  key: "quickbase-update-record",
  name: "Update Record",
  description: "Updates an existing record in a Quick Base table. [See the documentation](https://developer.quickbase.com/)",
  version: "0.0.1",
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
    updateData: {
      propDefinition: [
        quickbase,
        "updateData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.quickbase.updateRecord({
      tableId: this.tableId,
      recordId: this.recordId,
      updateData: this.updateData,
    });
    $.export("$summary", `Successfully updated record ${this.recordId}`);
    return response;
  },
};
