import supabase from "../../supabase.app.mjs";

export default {
  key: "supabase-delete-row",
  name: "Delete Row",
  type: "action",
  version: "0.1.1",
  description: "Deletes row(s) in a database. [See the docs here](https://supabase.com/docs/reference/javascript/delete)",
  props: {
    supabase,
    table: {
      propDefinition: [
        supabase,
        "table",
      ],
      description: "Name of the table to delete row(s) from",
    },
    column: {
      propDefinition: [
        supabase,
        "column",
      ],
      description: "Search column to find row(s) to delete",
    },
    value: {
      propDefinition: [
        supabase,
        "value",
      ],
      description: "Value of the search column in the row(s) to delete",
    },
  },
  async run({ $ }) {
    const response = await this.supabase.deleteRow(this.table, this.column, this.value);
    $.export("$summary", `Successfully deleted ${response.length} row(s) from table ${this.table}`);
    return response;
  },
};
