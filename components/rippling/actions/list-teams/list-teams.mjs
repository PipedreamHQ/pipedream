import rippling from "../../rippling.app.mjs";

export default {
  key: "rippling-list-teams",
  name: "List Teams",
  description: "Retrieves a list of all teams from Rippling. [See the documentation](https://developer.rippling.com/documentation/rest-api/reference/list-teams)",
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
        "expandTeams",
      ],
    },
    orderBy: {
      propDefinition: [
        rippling,
        "orderBy",
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
      fn: this.rippling.listTeams,
      args: {
        $,
        params: {
          order_by: this.orderBy,
          ...(this.expand && {
            expand: this.expand.join(","),
          }),
        },
      },
      max: this.maxResults,
    });

    $.export("$summary", `Successfully retrieved ${response?.length || 0} teams`);
    return response;
  },
};
