// x-pd-ai: optimized
import airtable from "../../airtable_oauth.app.mjs";

export default {
  key: "airtable_oauth-list-tables",
  name: "List Tables",
  description:
    "Get a list of tables in the selected base, including each table's fields and views. Use **List Bases** to look up a base ID. [See the documentation](https://airtable.com/developers/web/api/get-base-schema)",
  type: "action",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    airtable,
    baseId: {
      propDefinition: [
        airtable,
        "baseId",
      ],
    },
  },
  async run({ $ }) {
    const { tables } = await this.airtable.listTables({
      $,
      baseId: this.baseId,
    });
    $.export(
      "$summary",
      `Successfully retrieved ${tables.length} tables`,
    );
    return tables;
  },
};
