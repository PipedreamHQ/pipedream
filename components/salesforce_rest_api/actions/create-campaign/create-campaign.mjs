import common, { getProps } from "../common/base-create-update.mjs";
import campaign from "../../common/sobjects/campaign.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_campaign.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-campaign",
  name: "Create Campaign",
  description: `Creates a campaign. [See the documentation](${docsLink})`,
  version: "0.3.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
  },
  props: getProps({
    objType: campaign,
    docsLink,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars, max-len */
    const {
      salesforce,
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo,
      dateInfo,
      additionalFields,
      ...data
    } = this;
    /* eslint-enable no-unused-vars, max-len */
    const response = await salesforce.createRecord("Campaign", {
      $,
      data: {
        ...data,
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created campaign "${this.Name}"`);
    return response;
  },
};
