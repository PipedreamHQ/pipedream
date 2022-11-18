import supabase from "../../supabase.app.mjs";

export default {
  key: "supabase-insert-row",
  name: "Insert Row",
  type: "action",
  version: "0.0.1",
  description: "Inserts a new row into a database. [See the docs here](https://supabase.com/docs/reference/javascript/insert)",
  props: {
    supabase,
    table: {
      type: "string",
      label: "Table",
      description: "Name of the table to insert row into",
    },
    data: {
      type: "object",
      label: "Row Data",
      description: "Enter the column names and values as key/value pairs",
    },
  },
  async run({ $ }) {
    const response = await this.supabase.insertRow(this.table, this.data);
    $.export("$summary", `Successfully inserted row into table ${this.table}`);
    return response;
  },
};
