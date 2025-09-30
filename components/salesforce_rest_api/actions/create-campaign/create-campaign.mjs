import common, { getProps } from "../common/base-create-update.mjs";
import campaign from "../../common/sobjects/campaign.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_campaign.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-campaign",
  name: "Create Campaign",
  description: `Creates a marketing campaign. [See the documentation](${docsLink})`,
  version: "0.3.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return "Campaign";
    },
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
      salesforce,
      getAdvancedProps,
      getObjectType,
      getAdditionalFields,
      formatDateTimeProps,
      useAdvancedProps,
      docsInfo,
      dateInfo,
      additionalFields,
      StartDate,
      EndDate,
      ...data
    } = this;
    /* eslint-enable no-unused-vars, max-len */
    const response = await salesforce.createRecord("Campaign", {
      $,
      data: {
        ...data,
        ...formatDateTimeProps({
          StartDate,
          EndDate,
        }),
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created campaign "${this.Name}"`);
    return response;
  },
};
