import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-get-lead-by-id",
  name: "Get Lead by ID",
  description: "Retrieves a single lead by its ID, including its title, owner, linked person or organization, value, label IDs and expected close date."
    + " Lead IDs are UUIDs, not numbers. Use **Search Leads** or **Get All Leads** to find the ID."
    + " Example: `Lead ID` `adf21080-0e10-11eb-879b-05d71fb426ec`. Use **Update Lead** to change it."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/Leads#getLead)",
  version: "0.0.11",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    pipedriveApp,
    leadId: {
      propDefinition: [
        pipedriveApp,
        "leadId",
      ],
      description: "The ID of the lead to retrieve (a UUID), e.g. `adf21080-0e10-11eb-879b-05d71fb426ec`. Use **Search Leads** or **Get All Leads** to find it (the `id` field).",
      optional: false,
    },
  },
  async run({ $ }) {
    const { data } = await this.pipedriveApp.getLead(this.leadId);
    $.export("$summary", `Successfully retrieved lead with ID: ${this.leadId}`);
    return data;
  },
};
