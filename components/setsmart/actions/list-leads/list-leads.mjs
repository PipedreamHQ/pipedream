import setsmart from "../../setsmart.app.mjs";

export default {
  key: "setsmart-list-leads",
  name: "List Leads",
  description: "List every lead in the workspace. [See the documentation](https://setsmart.io/api-documentation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    setsmart,
  },
  async run({ $ }) {
    const response = await this.setsmart.listLeads({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response?.length ?? 0} lead(s)`);
    return response;
  },
};
