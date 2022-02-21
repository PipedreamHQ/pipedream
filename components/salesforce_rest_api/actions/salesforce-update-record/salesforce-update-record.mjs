// legacy_hash_id: a_l0i2Pq
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-update-record",
  name: "Update Record",
  description: "Updates a record of a given resource, its id and fields values. Use resource field values in the request data.",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce_rest_api: {
      type: "app",
      app: "salesforce_rest_api",
    },
    sobject_name: {
      type: "string",
      description: "Type of Salesforce standard object to update.",
    },
    sobject_id: {
      type: "string",
      description: "Id of the Salesforce standard object record to update.",
    },
    sobject: {
      type: "object",
      description: "Data of the Salesforce standard object record to update.\nSalesforce standard objects are described in [Standard Objects](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_list.htm) section of the [SOAP API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_quickstart_intro.htm).",
    },
  },
  async run({ $ }) {
  //See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm
    return await axios($, {
      "method": "patch",
      "url": `${this.salesforce_rest_api.$auth.instance_url}/services/data/v20.0/sobjects/${this.sobject_name}/${this.sobject_id}`,
      "Content-Type": "application/json",
      "headers": {
        Authorization: `Bearer ${this.salesforce_rest_api.$auth.oauth_access_token}`,
      },
      "data": this.sobject,
    });
  },
};
