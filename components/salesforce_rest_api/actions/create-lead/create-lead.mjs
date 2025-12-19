import common, { getProps } from "../common/base-create-update.mjs";
import lead from "../../common/sobjects/lead.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_lead.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-lead",
  name: "Create Lead",
  description: `Creates a lead. [See the documentation](${docsLink})`,
  version: "0.3.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return "Lead";
    },
    getAdvancedProps() {
      return lead.extraProps;
    },
  },
  props: getProps({
    objType: lead,
    docsLink,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
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
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("Lead", {
      $,
      data: {
        ...data,
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created lead "${this.LastName}"`);
    return response;
  },
};
