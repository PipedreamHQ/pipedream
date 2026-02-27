import issueUpdatedInstant from "@pipedream/linear_app/sources/issue-updated-instant/issue-updated-instant.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...issueUpdatedInstant,
  ...utils.getAppProps(issueUpdatedInstant),
  key: "linear-issue-updated-instant",
  description: "Triggers instantly when any issue is updated in Linear. Provides complete issue details with changes. Supports filtering by team and project. Includes all updates except status changes. Uses OAuth authentication. See Linear docs for additional info [here](https://linear.app/developers/webhooks).",
  version: "0.3.16",
};
