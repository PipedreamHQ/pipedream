// x-pd-ai: optimized
import elasticSecurity from "../../elastic_security.app.mjs";
import {
  CASE_COMMENT_TYPE_USER, CASE_OWNER,
} from "../../common/constants.mjs";

export default {
  key: "elastic_security-add-case-comment",
  name: "Add Case Comment",
  description: "Add a user comment to an Elastic Security case via POST /api/cases/{caseId}/comments."
    + " Use this to log investigation notes or updates on a case without changing its status or fields — use **Create or Update Case** for that."
    + " Run **Find Cases** first to obtain a valid case ID."
    + " Example: calling with `caseId: \"a1c1...\"` and `comment: \"Confirmed unauthorized access via badge logs.\"` returns the updated case object with `totalComment` incremented and the new comment in `comments`."
    + " [See the documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-addcasecommentdefaultspace)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    elasticSecurity,
    caseId: {
      propDefinition: [
        elasticSecurity,
        "caseId",
      ],
      description: "The ID of the case to comment on. Run **Find Cases** first to obtain valid case IDs.",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The text of the user comment to add.",
    },
  },
  async run({ $ }) {
    const response = await this.elasticSecurity.addCaseComment({
      $,
      caseId: this.caseId,
      data: {
        type: CASE_COMMENT_TYPE_USER,
        comment: this.comment,
        owner: CASE_OWNER,
      },
    });
    $.export("$summary", `Added comment to case ${this.caseId}`);
    return response;
  },
};
