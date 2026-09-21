import common, { getProps } from "../common/base-create-update.mjs";
import caseComment from "../../common/sobjects/caseComment.mjs";

const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_casecomment.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-casecomment",
  name: "Create Case Comment",
  description: "Add a comment to an existing Salesforce case."
    + " Use **List Cases** to find the case ID, and **List Case Comments** to read the existing thread first."
    + " Comments are visible in the case feed - **List Case Feed Items** shows them as `CaseCommentPost` entries."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.3.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  methods: {
    ...common.methods,
  },
  props: getProps({
    objType: caseComment,
    docsLink,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo,
      additionalFields,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("CaseComment", {
      $,
      data: {
        ...data,
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created case comment for ${this.ParentId}`);
    return response;
  },
};
