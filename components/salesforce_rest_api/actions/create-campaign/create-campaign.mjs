import common from "../common/base.mjs";
import campaign from "../../common/sobjects/campaign.mjs";
import {
  pickBy, pick,
} from "lodash-es";
import { toSingleLineString } from "../../common/utils.mjs";

const { salesforce } = common.props;

export default {
  ...common,
  key: "salesforce_rest_api-create-campaign",
  name: "Create Campaign",
  description: toSingleLineString(`
    Creates a marketing campaign, such as a direct mail promotion, webinar, or trade show.
    See [Campaign SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_campaign.htm)
    and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)
  `),
  version: "0.2.6",
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
      optional: true,
    },
  },
  additionalProps() {
    return this.additionalProps(this.selector, campaign);
  },
  async run({ $ }) {
    const data = pickBy(pick(this, [
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
