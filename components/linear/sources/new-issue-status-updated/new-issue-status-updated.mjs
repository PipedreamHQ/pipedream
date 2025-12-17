import newIssueStatusUpdated from "@pipedream/linear_app/sources/new-issue-status-updated/new-issue-status-updated.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...newIssueStatusUpdated,
  ...utils.getAppProps(newIssueStatusUpdated),
  key: "linear-new-issue-status-updated",
  description: "Triggers instantly when an issue's workflow state changes (e.g., Todo to In Progress). Returns issue with previous and current state info. Can filter by specific target state. Uses OAuth authentication. See Linear docs for additional info [here](https://linear.app/developers/webhooks).",
  version: "0.1.16",
};
