import supabase from "../../supabase.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "supabase-count-rows",
  name: "Count Rows",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Counts rows in a database table, with optional filtering conditions. [See the docs here](https://supabase.com/docs/reference/javascript/select#querying-with-count-option)",
  props: {
    supabase,
    table: {
      propDefinition: [
        supabase,
        "table",
      ],
      description: "Name of the table to count rows from",
    },
    column: {
      propDefinition: [
        supabase,
        "column",
      ],
      description: "Column name to filter by (optional)",
      optional: true,
    },
    filter: {
      propDefinition: [
        supabase,
        "filter",
      ],
      description: "Filter type for the query (optional)",
      optional: true,
    },
    value: {
      propDefinition: [
        supabase,
        "value",
      ],
      description: "Value to filter by (optional)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      table,
      column,
      filter,
      value,
    } = this;

    if ((column || filter || value) && !(column && filter && value)) {
      throw new ConfigurationError("If `column`, `filter`, or `value` is used, all three must be entered");
    }

    const response = await this.supabase.countRows({
      table,
      column,
      filter,
      value,
    });

    $.export("$summary", `Successfully counted ${response.count} row(s) in table ${table}`);
    return response;
  },
};
