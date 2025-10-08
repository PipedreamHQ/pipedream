import updateIssue from "@pipedream/linear_app/actions/update-issue/update-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...updateIssue,
  ...utils.getAppProps(updateIssue),
  key: "linear-update-issue",
  description: "Updates an existing Linear issue. Can modify title, description, assignee, state, project, team, labels, priority, and dates. Returns updated issue details. Uses OAuth authentication. See Linear docs for additional info [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues).",
  version: "0.1.12",
};
