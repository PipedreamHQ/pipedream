import asana from "../../asana.app.mjs";

export default {
  key: "asana-get-portfolio",
  name: "Get Portfolio",
  description: "Returns the complete portfolio record for a single portfolio. [See the documentation](https://developers.asana.com/reference/getportfolio)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    asana,
    workspace: {
      label: "Workspace",
      description: "The workspace or organization the portfolio belongs to. Use the **List Workspaces** action to find available workspace GIDs.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
    },
    portfolioId: {
      propDefinition: [
        asana,
        "portfolioId",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
    optFields: {
      propDefinition: [
        asana,
        "optFields",
      ],
      description: "Optional portfolio properties to include in the response (e.g. `custom_field_settings`, `custom_fields`, `members`, `owner`, `start_on`, `due_on`, `created_at`). Nested paths are allowed; `gid` is always returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data: portfolio } = await this.asana.getPortfolio({
      portfolioId: this.portfolioId,
      params: {
        opt_fields: Array.isArray(this.optFields) && this.optFields.length
          ? this.optFields.join(",")
          : undefined,
      },
      $,
    });

    $.export("$summary", `Successfully retrieved portfolio ${portfolio.name || this.portfolioId}`);

    return portfolio;
  },
};
