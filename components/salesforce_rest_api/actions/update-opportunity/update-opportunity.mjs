import common, { getProps } from "../common/base.mjs";
import opportunity from "../../common/sobjects/opportunity.mjs";
import { docsLink } from "../create-opportunity/create-opportunity.mjs";
import propsAsyncOptions from "../../common/props-async-options.mjs";

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
  version: "0.3.{{ts}}",
  type: "action",
  methods: {
    ...common.methods,
    getAdvancedProps() {
      return opportunity.extraProps;
    },
  },
  props: {
    salesforce,
    opportunityId: {
      ...propsAsyncOptions.OpportunityId,
      async options() {
        return this.salesforce.listRecordOptions({
          objType: "Opportunity",
        });
      },
    },
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      opportunityId,
      useAdvancedProps,
      docsInfo,
      dateInfo,
      additionalFields,
      CloseDate,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.updateOpportunity({
      $,
      id: opportunityId,
      data: {
        ...data,
        ...this.formatDateTimeProps({
          CloseDate,
        }),
        ...this.getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully updated opportunity (ID: ${this.OpportunityId})`);
    return response;
  },
};
