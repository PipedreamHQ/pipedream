import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-list-am-equipment-items",
  name: "List Asset Management Equipment Items",
  description:
    "List equipment items from the Asset Management (AM) API on Universal API. Returns a cursor-paginated array of equipment item objects. [See the documentation](https://docs.universalapi.io/reference/list-equipment-items).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listAmEquipmentItems({
      $,
      cursor: this.cursor,
      limit: this.limit,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} equipment item(s)`);
    return response;
  },
};
