import common, { getProps } from "../common/base.mjs";
import caseComment from "../../common/sobjects/caseComment.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_casecomment.htm";

/* eslint-disable no-unused-vars */
const {
  useAdvancedProps, ...props
} = getProps({
  objType: caseComment,
  docsLink,
});
/* eslint-enable no-unused-vars */

export default {
  ...common,
  key: "salesforce_rest_api-create-casecomment",
  name: "Create Case Comment",
  description: `Creates a Case Comment on a selected Case. [See the documentation](${docsLink})`,
  version: "0.3.{{ts}}",
  type: "action",
  props,
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce, docsInfo,  ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createCaseComment({
      $,
      data,
    });
    $.export("$summary", `Successfully created case comment for ${this.ParentId}`);
    return response;
  },
};
