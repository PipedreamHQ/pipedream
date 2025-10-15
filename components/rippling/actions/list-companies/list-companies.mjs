import rippling from "../../rippling.app.mjs";

export default {
  key: "rippling-list-companies",
  name: "List Companies",
  description: "Retrieves a list of all companies from Rippling. [See the documentation](https://developer.rippling.com/documentation/rest-api/reference/list-companies)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    rippling,
    expand: {
      propDefinition: [
        rippling,
        "expandCompanies",
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
      fn: this.rippling.listCompanies,
      args: {
        $,
        params: {
          order_by: `${this.orderBy} ${this.orderDirection}`,
          ...(this.expand && {
            expand: this.expand.join(","),
          }),
        },
      },
      max: this.maxResults,
    });

    $.export("$summary", `Successfully retrieved ${response?.length || 0} companies`);
    return response;
  },
};
