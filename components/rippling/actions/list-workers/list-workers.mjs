import rippling from "../../rippling.app.mjs";

export default {
  key: "rippling-list-workers",
  name: "List Workers",
  description: "Retrieves a list of all workers from Rippling. [See the documentation](https://developer.rippling.com/documentation/rest-api/reference/list-workers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    rippling,
    filter: {
      propDefinition: [
        rippling,
        "filterWorkers",
      ],
    },
    expand: {
      propDefinition: [
        rippling,
        "expandWorkers",
      ],
    },
    orderBy: {
      propDefinition: [
        rippling,
        "orderBy",
      ],
    },
    orderDirection: {
      propDefinition: [
        rippling,
        "orderDirection",
      ],
    },
    maxResults: {
      propDefinition: [
        rippling,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rippling.getPaginatedResources({
      fn: this.rippling.listWorkers,
      args: {
        $,
        params: {
          order_by: `${this.orderBy} ${this.orderDirection}`,
          ...(this.filter && {
            filter: this.filter,
          }),
          ...(this.expand && {
            expand: this.expand.join(","),
          }),
        },
      },
      max: this.maxResults,
    });

    $.export("$summary", `Successfully retrieved ${response?.length || 0} workers`);
    return response;
  },
};
