import salesforce from "../../salesforce_rest_api.app.mjs";
import constants from "../../common/constants.mjs";
import commonProps from "../../common/props-async-options.mjs";

export default {
  key: "salesforce_rest_api-add-lead-to-campaign",
  name: "Add Lead to Campaign",
  description: "Adds an existing lead to an existing campaign. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_campaignmember.htm)",
  version: "0.1.0",
  type: "action",
  props: {
    salesforce,
    campaignId: {
      ...commonProps.CampaignId,
      description: "The Campaign to add a Lead to.",
      async options() {
        return this.salesforce.listRecordOptions({
          objType: "Campaign",
        });
      },
    },
    leadId: {
      ...commonProps.LeadId,
      description: "The Lead to add to the selected Campaign.",
      async options() {
        return this.salesforce.listRecordOptions({
          objType: "Lead",
        });
      },
    },
  },
  async run({ $ }) {
    const {
      salesforce, campaignId, leadId,
    } = this;
    const response = await salesforce.createObject({
      $,
      objectType: constants.OBJECT_TYPE.CAMPAIGN_MEMBER,
      data: {
        CampaignId: campaignId,
        LeadId: leadId,
      },
    });
    $.export("$summary", `Successfully added lead (ID: ${leadId}) to campaign (ID: ${campaignId})`);
    return response;
  },
};
