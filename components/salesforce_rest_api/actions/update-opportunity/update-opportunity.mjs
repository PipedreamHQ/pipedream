import common, { getProps } from "../common/base-create-update.mjs";
import opportunity from "../../common/sobjects/opportunity.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";
import { docsLink } from "../create-opportunity/create-opportunity.mjs";

/* eslint-disable no-unused-vars */
const {
  salesforce: _sf, ...props
} = getProps({
  createOrUpdate: "update",
  objType: opportunity,
  docsLink,
  showDateInfo: true,
});
/* eslint-enable no-unused-vars */

export default {
  ...common,
  key: "salesforce_rest_api-update-opportunity",
  name: "Update Opportunity",
  description: `Updates an opportunity. [See the documentation](${docsLink})`,
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
  props: {
    salesforce,
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the Opportunity to update. Use **SOQL Query** to find the ID.",
    },
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdditionalFields,
      formatDateTimeProps,
      opportunityId,
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
