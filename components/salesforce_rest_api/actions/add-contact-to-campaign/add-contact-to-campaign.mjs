import salesforce from "../../salesforce_rest_api.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "salesforce_rest_api-add-contact-to-campaign",
  name: "Add Contact to Campaign",
  description: "Adds an existing contact to an existing campaign. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_campaignmember.htm)",
  version: "0.1.0",
  type: "action",
  props: {
    salesforce,
    campaignId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "Campaign",
          nameField: "Name",
        }),
      ],
      label: "Campaign ID",
      description: "The Campaign to add a Contact to.",
    },
    contactId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "Contact",
          nameField: "Name",
        }),
      ],
      label: "Contact ID",
      description: "The Contact to add to the selected Campaign.",
    },
  },
  async run({ $ }) {
    const {
      salesforce, campaignId, contactId,
    } = this;
    const response = await salesforce.createObject({
      $,
      objectType: constants.OBJECT_TYPE.CAMPAIGN_MEMBER,
      data: {
        CampaignId: campaignId,
        ContactId: contactId,
      },
    });
    $.export("$summary", `Successfully added contact (ID: ${contactId}) to campaign (ID: ${campaignId})`);
    return response;
  },
};
