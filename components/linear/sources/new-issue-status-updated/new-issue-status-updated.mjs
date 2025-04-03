import newIssueStatusUpdated from "@pipedream/linear_app/sources/new-issue-status-updated/new-issue-status-updated.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...newIssueStatusUpdated,
  ...utils.getAppProps(newIssueStatusUpdated),
  key: "linear-new-issue-status-updated",
  description: "Emit new event when the status of an issue is updated (OAuth). [See the documentation](https://developers.linear.app/docs/graphql/webhooks)",
  version: "0.1.12",
};
