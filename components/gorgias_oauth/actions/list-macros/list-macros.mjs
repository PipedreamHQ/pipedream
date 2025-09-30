import gorgias_oauth from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-list-macros",
  name: "List Macros",
  description: "List all macros. [See the documentation](https://developers.gorgias.com/reference/list-macros)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gorgias_oauth,
    search: {
      type: "string",
      label: "Search",
      description: "Filter macros containing the given search query",
      optional: true,
    },
    limit: {
      propDefinition: [
        gorgias_oauth,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      search: this.search,
      limit: this.limit,
    };

    const macros = [];
    const paginator = this.gorgias_oauth.paginate({
      $,
      fn: this.gorgias_oauth.listMacros,
      params,
    });
    for await (const macro of paginator) {
      macros.push(macro);
    }

    const suffix = macros.length === 1
      ? ""
      : "s";
    $.export("$summary", `Returned ${macros.length} macro${suffix}`);
    return macros;
  },
};
