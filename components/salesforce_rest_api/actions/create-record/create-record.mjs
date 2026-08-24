// x-pd-ai: optimized
import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-create-record",
  name: "Create Record",
  description: "Create a Salesforce record of any object type."
    + " Use **List Objects** to discover object types and **Describe Object** to discover fields."
    + " "
    + "[See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    salesforce,
    objectType: {
      type: "string",
      label: "Object Type",
      description:
        "The Salesforce object API name (e.g. `Account`, `Contact`, `Lead`, `Opportunity`, `Case`, `Task`, `Event`). Use **List Objects** to discover custom object types (ending in `__c`).",
    },
    fields: {
      type: "object",
      label: "Fields",
      description:
        "Field name -> value pairs for the new record. Example for Contact: `{\"LastName\": \"Smith\", \"Email\": \"smith@acme.com\", \"AccountId\": \"001xxx\"}`. Use **Describe Object** to discover valid field names and picklist values.",
    },
  },
  async run({ $ }) {
    const response = await this.salesforce.createRecord(this.objectType, {
      $,
      data: this.fields,
    });
    $.export("$summary", `Successfully created ${this.objectType} record (ID: ${response.id})`);
    return response;
  },
};
