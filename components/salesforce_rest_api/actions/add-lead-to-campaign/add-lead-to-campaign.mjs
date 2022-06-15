import salesForceRestApi from "../../salesforce_rest_api.app.mjs";
import {
  removeNullEntries, toSingleLineString,
} from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-add-lead-to-campaign",
  name: "Add Lead to Campaign",
  description: toSingleLineString(`
    Adds an existing lead to an existing campaign.
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
    LeadId: {
      propDefinition: [
        salesForceRestApi,
        "sobjectId",
        () => ({
          objectType: "Lead",
        }),
      ],
      label: "Lead ID",
      description: "ID of the Lead who is associated with a Campaign.",
    },
  },
  async run({ $ }) {
    const data = removeNullEntries({
      CampaignId: this.CampaignId,
      LeadId: this.LeadId,
    });
    const response = await this.salesForceRestApi.createObject("CampaignMember", data);
    response && $.export("$summary", "Successfully added lead to campaign");
    return response;
  },
};
