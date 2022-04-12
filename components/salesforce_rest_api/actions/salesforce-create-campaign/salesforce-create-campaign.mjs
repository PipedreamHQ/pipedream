import salesforce from "../../salesforce_rest_api.app.mjs";
import campaign from "../../common/sobjects/campaign.mjs";
import lodash from "lodash";

export default {
  key: "salesforce_rest_api-salesforce-create-campaign",
  name: "Create Campaign",
  description: "Creates a marketing campaign, such as a direct mail promotion, webinar, or trade show. See [Campaign SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_campaign.htm) and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)",
  version: "0.2.2",
  type: "action",
  props: {
    salesforce,
    Name: {
      type: "string",
      label: "Name",
      description: "Required. Name of the campaign. Limit: is 80 characters.",
    },
    selector: {
      propDefinition: [
        salesforce,
        "fieldSelector",
      ],
      description: `${salesforce.propDefinitions.fieldSelector.description} Campaign`,
      options: () => Object.keys(campaign),
      reloadProps: true,
    },
  },
  async additionalProps() {
    return this.salesforce.additionalProps(this.selector, campaign);
  },
  async run({ $ }) {
    const data = lodash.pickBy(lodash.pick(this, [
      "Name",
      ...this.selector,
    ]));
    const response = await this.salesforce.createCampaign({
      $,
      data,
    });
    $.export("$summary", `Created campaign "${this.Name}"`);
    return response;
  },
};
