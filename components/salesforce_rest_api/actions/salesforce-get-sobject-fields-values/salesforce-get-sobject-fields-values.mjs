// legacy_hash_id: a_Xzi1vA
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-get-sobject-fields-values",
  name: "Get Field Values from a Standard Object Record",
  description: "Retrieve field values from a record. You can specify the fields you want to retrieve.",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce_rest_api: {
      type: "app",
      app: "salesforce_rest_api",
    },
    sobject_name: {
      type: "string",
      description: "Salesforce standard object type of the record to get field values from.",
    },
    sobject_id: {
      type: "string",
      description: "Id of the Salesforce standard object to get field values from.",
    },
    sobject_fields: {
      type: "string",
      description: "Comma separated list of the Salesforce standard object's fields to get values from.",
    },
  },
  async run({ $ }) {
  //See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm
    return await axios($, {
      url: `${this.salesforce_rest_api.$auth.instance_url}/services/data/v20.0/sobjects/${encodeURI(this.sobject_name)}/${encodeURI(this.sobject_id)}?fields=${encodeURI(this.sobject_fields)}`,
      headers: {
        Authorization: `Bearer ${this.salesforce_rest_api.$auth.oauth_access_token}`,
      },
    });
  },
};
