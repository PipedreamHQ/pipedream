import common, { getProps } from "../common/base.mjs";
import campaign from "../../common/sobjects/campaign.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_campaign.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-campaign",
  name: "Create Campaign",
  description: `Creates a marketing campaign. [See the documentation](${docsLink})`,
  version: "0.3.{{ts}}",
  type: "action",
  methods: {
    ...common.methods,
    getAdvancedProps() {
      return campaign.extraProps;
    },
  },
  props: getProps({
    objType: campaign,
    docsLink,
    showDateInfo: true,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars, max-len */
    const {
      salesforce, useAdvancedProps, docsInfo, dateInfo, additionalFields, StartDate, EndDate, ...data
    } = this;
    /* eslint-enable no-unused-vars, max-len */
    const response = await salesforce.createCampaign({
      $,
      data: {
        ...data,
        ...this.formatDateTimeProps({
          StartDate,
          EndDate,
        }),
        ...this.getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created campaign "${this.Name}"`);
    return response;
  },
};
