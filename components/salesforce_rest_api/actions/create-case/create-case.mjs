import common, { getProps } from "../common/base.mjs";
import caseObj from "../../common/sobjects/case.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_case.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-case",
  name: "Create Case",
  description: `Creates a Case, which represents a customer issue or problem. [See the documentation](${docsLink})`,
  version: "0.3.0",
  type: "action",
  methods: {
    ...common.methods,
    getAdvancedProps() {
      return caseObj.extraProps;
    },
  },
  props: getProps({
    objType: caseObj,
    docsLink,
    showDateInfo: true,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce, useAdvancedProps, docsInfo, additionalFields, SlaStartDate, ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createCase({
      $,
      data: {
        ...data,
        ...this.formatDateTimeProps({
          SlaStartDate,
        }),
        ...this.getAdditionalFields(),
      },
    });
    const summary = (this.SuppliedName && ` "${this.SuppliedName}"`) ?? (this.SuppliedEmail && ` with email ${this.SuppliedEmail}`) ?? "";
    $.export("$summary", `Successfully created case${summary}`);
    return response;
  },
};
