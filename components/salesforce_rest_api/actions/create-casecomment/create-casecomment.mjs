// x-pd-ai: optimized
import common, { getProps } from "../common/base-create-update.mjs";
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
  description: "Add a comment to an existing Salesforce case."
    + " Use **List Cases** to find the case ID, and **List Case Comments** to read the existing thread first."
    + " Comments are visible in the case feed - **List Case Feed Items** shows them as `CaseCommentPost` entries."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.3.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props,
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdvancedProps,
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("CaseComment", {
      $,
      data,
    });
    $.export("$summary", `Successfully created case comment for ${this.ParentId}`);
    return response;
  },
};
