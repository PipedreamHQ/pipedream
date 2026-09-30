import removeLabelFromIssue from "@pipedream/linear_app/actions/remove-label-from-issue/remove-label-from-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...removeLabelFromIssue,
  ...utils.getAppProps(removeLabelFromIssue),
  key: "linear-remove-label-from-issue",
  description: "Remove a label from an issue in Linear. The label can be re-added at any time, so this operation is reversible. Use **Search Issues** to find the issue ID, and **List Labels** to find the label ID. Example: `issueId: \"iss_01abc\"`, `labelId: \"lbl_bug123\"` → removes the label and returns `{success: true}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=issueremovelabel)",
  version: "0.0.4",
  ai: "optimized",
};
