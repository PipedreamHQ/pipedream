import salesforce from "../../salesforce_rest_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "salesforce_rest_api-salesforce-create-record",
  name: "Create Record",
  description: "Create new records of a given resource. Resource field values in the request data, and then use the POST method of the resource. The response body will contain the ID of the created record if the call is successful. Make user to include required fields of the resource you are creating.",
  version: "0.2.1",
  type: "action",
  props: {
    salesforce,
    sobject_name: {
      type: "string",
      label: "sobject_name",
      description: "Salesforce standard object's name to retrive basic info for.",
    },
    sobject: {
      type: "object",
      label: "",
      description: "Data of the Salesforce standard object record to create.\nSalesforce standard objects are described in [Standard Objects](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_list.htm) section of the [SOAP API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_quickstart_intro.htm).",
    },
  },
  async run({ $ }) {
    //See the API docs here: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm
    return await axios($, {
      "method": "post",
      "url": `${this.salesforce.$auth.instance_url}/services/data/v20.0/sobjects/${this.sobject_name}/`,
      "Content-Type": "application/json",
      "headers": {
        Authorization: `Bearer ${this.salesforce.$auth.oauth_access_token}`,
      },
      "data": this.sobject,
    });
  },
};
