import quickbase from "../../quickbase.app.mjs";

export default {
  key: "quickbase-create-record",
  name: "Create Record",
  description: "Creates a new record in a Quick Base table. [See the documentation](https://developer.quickbase.com/)",
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
    recordData: {
      propDefinition: [
        quickbase,
        "recordData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.quickbase.createRecord({
      tableId: this.tableId,
      recordData: this.recordData,
    });
    $.export("$summary", `Successfully created record in table ${this.tableId}`);
    return response;
  },
};
