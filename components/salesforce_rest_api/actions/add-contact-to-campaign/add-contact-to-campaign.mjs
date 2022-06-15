import salesForceRestApi from "../../salesforce_rest_api.app.mjs";
import {
  removeNullEntries, toSingleLineString,
} from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-add-contact-to-campaign",
  name: "Add Contact to Campaign",
  description: toSingleLineString(`
    Adds an existing contact to an existing campaign.
    See [Event SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_campaignmember.htm)
    and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)
  `),
  version: "0.0.1",
  type: "action",
  props: {
    salesForceRestApi,
    CampaignId: {
      propDefinition: [
        salesForceRestApi,
        "sobjectId",
        () => ({
          objectType: "Campaign",
        }),
      ],
      label: "Campaign ID",
      description: "ID of the Campaign to which this Lead is associated.",
    },
    ContactId: {
      propDefinition: [
        salesForceRestApi,
        "sobjectId",
        () => ({
          objectType: "Contact",
        }),
      ],
      label: "Contact ID",
      description: "ID of the Contact who is associated with a Campaign.",
    },
  },
  async run({ $ }) {
    const data = removeNullEntries({
      CampaignId: this.CampaignId,
      ContactId: this.ContactId,
    });
    const response = await this.salesForceRestApi.createObject("CampaignMember", data);
    response && $.export("$summary", "Successfully added contact to campaign");
    return response;
  },
};
