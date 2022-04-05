import salesforce from "../../salesforce_rest_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-delete-opportunity",
  name: "Delete Opportunity",
  description: "Deletes an opportunity, which represents an opportunity, which is a sale or pending deal.",
  version: "0.2.2",
  type: "action",
  props: {
    salesforce,
    OpportunityId: {
      type: "string",
      label: "OpportunityId",
      description: "ID of the Opportunity to delete.",
    },
  },
  async run({ $ }) {
    // See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_delete_record.htm
    // Opportunity object: https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_opportunity.htm

    if (!this.OpportunityId) {
      throw new Error("Must provide OpportunityId parameter.");
    }

    return await axios($, {
      "method": "delete",
      "url": `${this.salesforce.$auth.instance_url}/services/data/v20.0/sobjects/Opportunity/${this.OpportunityId}`,
      "Content-Type": "application/json",
      "headers": {
        Authorization: `Bearer ${this.salesforce.$auth.oauth_access_token}`,
      },
    });
  },
};
