import removeLabelFromIssue from "@pipedream/linear_app/actions/remove-label-from-issue/remove-label-from-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...removeLabelFromIssue,
  ...utils.getAppProps(removeLabelFromIssue),
  key: "linear-remove-label-from-issue",
  description: "Remove a label from an issue in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=issueremovelabel).",
  version: "0.0.1",
};
