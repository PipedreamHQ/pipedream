import removeLabelFromIssue from "@pipedream/linear_app/actions/remove-label-from-issue/remove-label-from-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...removeLabelFromIssue,
  ...utils.getAppProps(removeLabelFromIssue),
  key: "linear-remove-label-from-issue",
  description: "Removes one label from a Linear issue and leaves its other labels in place. To replace all of an issue's labels at once, use **Update Issue** with `labelIds` instead. The label can be re-added at any time, so this operation is reversible. Use **Search Issues** to find the issue ID, and **List Labels** to find the label ID. Returns the issue's `id`, `identifier`, `title`, `url` and `state` after the change. Example: `issueId: \"7df5e7f9-a357-4539-ae94-4a004fec635f\"`, `labelId: \"ab1b2c3d-0000-0000-0000-000000000005\"` → returns `{success: true, issue: {id: \"7df5e7f9-a357-4539-ae94-4a004fec635f\", identifier: \"ENG-42\", title: \"Fix login redirect on mobile\", url: \"https://linear.app/acme/issue/ENG-42/fix-login-redirect-on-mobile\", state: {name: \"In Progress\"}}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=issueremovelabel)",
  version: "0.0.3",
  ai: "optimized",
};
