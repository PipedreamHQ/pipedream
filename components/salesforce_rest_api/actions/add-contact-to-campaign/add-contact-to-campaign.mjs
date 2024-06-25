import salesForceRestApi from "../../salesforce_rest_api.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "salesforce_rest_api-add-contact-to-campaign",
  name: "Add Contact to Campaign",
  description: toSingleLineString(`
    Adds an existing contact to an existing campaign. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_campaignmember.htm)
  `),
  version: "0.0.6",
  type: "action",
  props: {
    salesForceRestApi,
    campaignId: {
      propDefinition: [
        salesForceRestApi,
        "sobjectId",
        () => ({
          objectType: constants.OBJECT_TYPE.CAMPAIGN,
        }),
      ],
      label: "Campaign ID",
      description: "The Campaign to add a Contact to.",
    },
    contactId: {
      propDefinition: [
        salesForceRestApi,
        "sobjectId",
        () => ({
          objectType: constants.OBJECT_TYPE.CONTACT,
        }),
      ],
      label: "Contact ID",
      description: "The Contact to add to the selected Campaign.",
    },
  },
  async run({ $ }) {
    const data = {
      CampaignId: this.campaignId,
      ContactId: this.contactId,
    };
    const response = await this.salesForceRestApi.createObject(
      {
        $,
        objectType: constants.OBJECT_TYPE.CAMPAIGN_MEMBER,
        data,
      },
    );
    $.export("$summary", "Successfully added contact to campaign");
    return response;
  },
};
