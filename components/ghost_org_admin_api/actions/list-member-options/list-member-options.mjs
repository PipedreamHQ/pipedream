import ghost_org_admin_api from "../../ghost_org_admin_api.app.mjs";

export default {
  key: "ghost_org_admin_api-list-member-options",
  name: "List Member Options",
  description: "Retrieves available options for the Member field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ghost_org_admin_api,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await ghost_org_admin_api.propDefinitions.member.options
      .call(this.ghost_org_admin_api, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
