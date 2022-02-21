// legacy_hash_id: a_xqiqkn
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-delete-opportunity",
  name: "Delete Opportunity",
  description: "Deletes an opportunity, which represents an opportunity, which is a sale or pending deal.",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce_rest_api: {
      type: "app",
      app: "salesforce_rest_api",
    },
    OpportunityId: {
      type: "string",
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
      "url": `${this.salesforce_rest_api.$auth.instance_url}/services/data/v20.0/sobjects/Opportunity/${this.OpportunityId}`,
      "Content-Type": "application/json",
      "headers": {
        Authorization: `Bearer ${this.salesforce_rest_api.$auth.oauth_access_token}`,
      },
    });
  },
};
