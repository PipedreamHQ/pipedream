import affinity from "../../affinity.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "affinity-create-opportunity",
  name: "Create Opportunity",
  description: "Creates a new opportunity entry in Affinity. [See the documentation](https://api-docs.affinity.co/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    affinity,
    opportunityDetails: {
      propDefinition: [
        affinity,
        "opportunityDetails",
      ],
    },
  },
  async run({ $ }) {
    const {
      name, list_id, person_ids, organization_ids,
    } = this.opportunityDetails;

    // Search for existing opportunities
    const existingOpportunities = await this.affinity.searchEntities(name);
    if (existingOpportunities.length > 0) {
      $.export("$summary", `Opportunity with name '${name}' already exists.`);
      return existingOpportunities;
    }

    // Create a new opportunity
    const newOpportunity = await this.affinity.createEntity({
      name,
      list_id,
      person_ids,
      organization_ids,
    });

    $.export("$summary", `Created new opportunity with ID: ${newOpportunity.id}`);
    return newOpportunity;
  },
};
