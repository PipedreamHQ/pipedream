// x-pd-ai: optimized
import common, { getProps } from "../common/base-create-update.mjs";
import opportunity from "../../common/sobjects/opportunity.mjs";

export const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_opportunity.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-opportunity",
  name: "Create Opportunity",
  description: "Create a Salesforce opportunity (a potential deal with an amount and close date)."
    + " Requires `Name`, `StageName` and `CloseDate` - use **Describe Object** on `Opportunity` to list the valid `StageName` values for your org."
    + " Use **Find Records** on `Account` to get the `AccountId` to attach the deal to."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.4.0",
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
    objType: opportunity,
    docsLink,
    showDateInfo: true,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdditionalFields,
      formatDateTimeProps,
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
