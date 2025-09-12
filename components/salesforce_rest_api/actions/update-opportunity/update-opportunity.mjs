import common, { getProps } from "../common/base-create-update.mjs";
import opportunity from "../../common/sobjects/opportunity.mjs";
import { docsLink } from "../create-opportunity/create-opportunity.mjs";

const {
  salesforce, ...props
} = getProps({
  createOrUpdate: "update",
  objType: opportunity,
  docsLink,
  showDateInfo: true,
});

export default {
  ...common,
  key: "salesforce_rest_api-update-opportunity",
  name: "Update Opportunity",
  description: `Updates an opportunity. [See the documentation](${docsLink})`,
  version: "0.3.3",
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
  props: {
    salesforce,
    opportunityId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "Opportunity",
          nameField: "Name",
        }),
      ],
      label: "Opportunity ID",
      description: "The Opportunity to update.",
    },
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdvancedProps,
      getObjectType,
      getAdditionalFields,
      formatDateTimeProps,
      opportunityId,
      useAdvancedProps,
      docsInfo,
      dateInfo,
      additionalFields,
      CloseDate,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.updateRecord("Opportunity", {
      $,
      id: opportunityId,
      data: {
        ...data,
        ...formatDateTimeProps({
          CloseDate,
        }),
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully updated opportunity (ID: ${opportunityId})`);
    return response;
  },
};
