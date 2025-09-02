import airtable from "../../airtable_oauth.app.mjs";

export default {
  key: "airtable_oauth-list-bases",
  name: "List Bases",
  description:
    "Get the list of bases that can be accessed. [See the documentation](https://airtable.com/developers/web/api/list-bases)",
  type: "action",
  version: "0.0.3",
  props: {
    airtable,
  },
  async run({ $ }) {
    const { bases } = await this.airtable.listBases({
      $,
    });
    $.export(
      "$summary",
      `Successfully retrieved ${bases.length} bases`,
    );
    return bases;
  },
};
