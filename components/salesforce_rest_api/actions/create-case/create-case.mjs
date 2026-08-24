// x-pd-ai: optimized
import common, { getProps } from "../common/base-create-update.mjs";
import caseObj from "../../common/sobjects/case.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_case.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-case",
  name: "Create Case",
  description: "Create a Salesforce support case (a customer issue or request)."
    + " Use **List Cases** to check whether a matching case already exists before creating a duplicate."
    + " After creating, use **Create Case Comment** to add notes or **List Case Feed Items** to read its activity."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.3.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return "Case";
    },
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
      salesforce,
      getAdvancedProps,
      getObjectType,
      getAdditionalFields,
      formatDateTimeProps,
      useAdvancedProps,
      docsInfo,
      dateInfo,
      additionalFields,
      SlaStartDate,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("Case", {
      $,
      data: {
        ...data,
        ...formatDateTimeProps({
          SlaStartDate,
        }),
        ...getAdditionalFields(),
      },
    });
    const summary = (this.SuppliedName && ` "${this.SuppliedName}"`) ?? (this.SuppliedEmail && ` with email ${this.SuppliedEmail}`) ?? "";
    $.export("$summary", `Successfully created case${summary}`);
    return response;
  },
};
