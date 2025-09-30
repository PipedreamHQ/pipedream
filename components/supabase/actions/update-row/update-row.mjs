import supabase from "../../supabase.app.mjs";

export default {
  key: "supabase-update-row",
  name: "Update Row",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Updates row(s) in a database. [See the docs here](https://supabase.com/docs/reference/javascript/update)",
  props: {
    supabase,
    table: {
      propDefinition: [
        supabase,
        "table",
      ],
      description: "Name of the table to update row(s) in",
    },
    column: {
      propDefinition: [
        supabase,
        "column",
      ],
      description: "Search column to find row(s) to update",
    },
    value: {
      propDefinition: [
        supabase,
        "value",
      ],
      description: "Value of the search column in the row(s) to update",
    },
    data: {
      propDefinition: [
        supabase,
        "data",
      ],
      description: "Enter the column names and values to update as key/value pairs",
    },
  },
  async run({ $ }) {
    const response = await this.supabase.updateRow(this.table, this.column, this.value, this.data);
    $.export("$summary", `Successfully updated ${response.length} row(s) from table ${this.table}`);
    return response;
  },
};
