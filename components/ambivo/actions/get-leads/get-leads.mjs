import ambivo from "../../ambivo.app.mjs";

export default {
  key: "ambivo-get-leads",
  name: "Get Leads",
  description: "Retrieves a list of leads in Ambivo. [See the documentation](https://fapi.ambivo.com/docs#/CRM%20Service%20Calls/get_leads_created_crm_leads_created_get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ambivo,
  },
  async run({ $ }) {
    const leads = await this.ambivo.listLeads({
      $,
    });
    $.export("$summary", `Successfully retrieved ${leads.length} lead${leads.length === 1
      ? ""
      : "s"}`);
    return leads;
  },
};
