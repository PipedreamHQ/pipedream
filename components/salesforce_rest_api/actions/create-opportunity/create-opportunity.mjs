import common, { getProps } from "../common/base-create-update.mjs";
import opportunity from "../../common/sobjects/opportunity.mjs";

export const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_opportunity.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-opportunity",
  name: "Create Opportunity",
  description: `Creates an opportunity. [See the documentation](${docsLink})`,
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
      return "Opportunity";
    },
    getAdvancedProps() {
      return opportunity.extraProps;
    },
  },
  props: getProps({
    objType: opportunity,
    docsLink,
    showDateInfo: true,
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
      CloseDate,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("Opportunity", {
      $,
      data: {
        ...data,
        ...formatDateTimeProps({
          CloseDate,
        }),
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created opportunity "${this.Name}"`);
    return response;
  },
};
