import setsmart from "../../setsmart.app.mjs";

export default {
  key: "setsmart-list-qualified-leads",
  name: "List Qualified Leads",
  description: "List the leads the AI assistant qualified as ready to book a call. [See the documentation](https://setsmart.io/api-documentation)",
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
    const response = await this.setsmart.listQualifiedLeads({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response?.length ?? 0} qualified lead(s)`);
    return response;
  },
};
