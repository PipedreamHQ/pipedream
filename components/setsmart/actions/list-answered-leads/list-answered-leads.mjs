import setsmart from "../../setsmart.app.mjs";

export default {
  key: "setsmart-list-answered-leads",
  name: "List Answered Leads",
  description: "List the leads who replied to the AI assistant. [See the documentation](https://setsmart.io/api-documentation)",
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
    const response = await this.setsmart.listAnsweredLeads({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response?.length ?? 0} answered lead(s)`);
    return response;
  },
};
