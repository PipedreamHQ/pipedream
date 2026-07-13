import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-list-am-equipment-items",
  name: "List Asset Management Equipment Items",
  description:
    "List equipment items from the Asset Management (AM) API on Universal API. Returns an array of equipment item objects (paginated internally, up to `maxResults`). [See the documentation](https://docs.universalapi.io/reference/list-equipment-items).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.paginate({
      fn: this.app.listAmEquipmentItems,
      args: {
        $,
      },
      maxResults: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${response.length} equipment item(s)`);
    return response;
  },
};
