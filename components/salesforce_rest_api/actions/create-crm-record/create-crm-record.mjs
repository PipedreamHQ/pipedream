// vandelay-test-dr
import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-create-crm-record",
  name: "Create Record",
  description:
    "Create a new Salesforce record of any object type."
    + " Use **Describe Object** first if you're unsure what fields are available or required."
    + " For picklist fields, use the API value from **Describe Object**, not the display label."
    + "\n\n"
    + "**Common required fields:**"
    + "\n- Account: `Name`"
    + "\n- Contact: `LastName`"
    + "\n- Lead: `LastName`, `Company`"
    + "\n- Opportunity: `Name`, `StageName`, `CloseDate`"
    + "\n- Case: `Subject`"
    + "\n- Task: `Subject`"
    + "\n- Event: `Subject`, `StartDateTime`, `EndDateTime`"
    + "\n\n"
    + "To add a Contact/Lead to a Campaign, create a CampaignMember:"
    + " `{\"CampaignId\": \"701xxx\", \"ContactId\": \"003xxx\"}` or `{\"CampaignId\": \"701xxx\", \"LeadId\": \"00Qxxx\"}`.",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    salesforce,
    objectType: {
      type: "string",
      label: "Object Type",
      description:
        "The Salesforce object API name (e.g. `Account`, `Contact`, `Lead`, `Opportunity`, `Case`, `Task`, `Event`)."
        + " Use **List Objects** to discover custom object types (ending in `__c`).",
    },
    properties: {
      type: "object",
      label: "Record Properties",
      description:
        "Field name → value pairs for the new record."
        + " Example for Contact: `{\"FirstName\": \"Jane\", \"LastName\": \"Doe\", \"Email\": \"jane@example.com\", \"AccountId\": \"001xxx\"}`."
        + " Example for Opportunity: `{\"Name\": \"Acme Deal\", \"StageName\": \"Prospecting\", \"CloseDate\": \"2025-12-31\", \"Amount\": 50000}`."
        + " Use **Describe Object** to discover valid field names and picklist values.",
    },
  },
  async run({ $ }) {
    const response = await this.salesforce.createRecord(this.objectType, {
      $,
      data: this.properties,
    });

    $.export(
      "$summary",
      `Created ${this.objectType} with ID ${response.id}`,
    );

    return response;
  },
};
