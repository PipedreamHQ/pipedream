import supabase from "../../supabase.app.mjs";

export default {
  key: "supabase-select-row",
  name: "Select Row",
  type: "action",
  version: "0.0.1",
  description: "Selects row(s) in a database. [See the docs here](https://supabase.com/docs/reference/javascript/select)",
  props: {
    supabase,
    table: {
      type: "string",
      label: "Table",
      description: "Name of the table to search",
    },
    column: {
      type: "string",
      label: "Column",
      description: "Column name to search by",
    },
    value: {
      type: "string",
      label: "Value",
      description: "Value of the column specified to search for",
    },
  },
  async run({ $ }) {
    const response = await this.supabase.selectRow(this.table, this.column, this.value);
    $.export("$summary", `Successfully retrieved rows from table ${this.table}`);
    return response;
  },
};
