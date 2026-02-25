import nutshell from "../../nutshell.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "nutshell-get-lead",
  name: "Get Lead",
  description: "Get a lead by ID. [See the documentation](https://developers-rpc.nutshell.com/#json-rpc)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nutshell,
    leadId: {
      type: "string",
      label: "Lead ID or Number",
      description: "The internal lead ID, or the lead number shown in the Nutshell UI (e.g. 1000 for Lead-1000). If lookup by ID returns nothing, the value is tried as a lead number.",
    },
  },
  async run({ $ }) {
    let lead = await this.nutshell.getLead({
      $,
      leadId: this.leadId,
    });
    if (lead == null) {
      lead = await this.nutshell.getLeadByNumber({
        $,
        leadNumber: this.leadId,
      });
    }
    if (lead == null) {
      throw new ConfigurationError(`No lead found for ID or number "${this.leadId}". In Nutshell, the number in the UI (e.g. Lead-1000) may differ from the internal ID—both are now tried.`);
    }
    $.export("$summary", `Successfully retrieved lead (ID: ${lead.id})`);
    return this.nutshell.formatLead(lead);
  },
};
