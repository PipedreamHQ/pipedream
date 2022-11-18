import supabase from "../../supabase.app.mjs";

export default {
  key: "supabase-upsert-row",
  name: "Upsert Row",
  type: "action",
  version: "0.0.1",
  description: "Updates a row in a database or inserts new row if not found. [See the docs here](https://supabase.com/docs/reference/javascript/upsert)",
  props: {
    supabase,
    table: {
      type: "string",
      label: "Table",
      description: "Name of the table to upsert row",
    },
    data: {
      type: "object",
      label: "Row Data",
      description: "Enter the column names and values as key/value pairs",
    },
  },
  async run({ $ }) {
    const response = await this.supabase.upsertRow(this.table, this.data);
    $.export("$summary", `Successfully upserted row into table ${this.table}`);
    return response;
  },
};
