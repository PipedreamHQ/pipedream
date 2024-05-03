import timetonic from "../../timetonic.app.mjs";

export default {
  key: "timetonic-create-row",
  name: "Create Row",
  description: "Create a new row within an existing table in TimeTonic",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    timetonic,
    tableId: {
      propDefinition: [
        timetonic,
        "tableId",
      ],
    },
    fields: {
      propDefinition: [
        timetonic,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.timetonic.createNewRow(this.tableId, this.fields);
    $.export("$summary", `Successfully created new row in table ${this.tableId}`);
    return response;
  },
};
