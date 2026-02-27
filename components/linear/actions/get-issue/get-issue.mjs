import getIssue from "@pipedream/linear_app/actions/get-issue/get-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...getIssue,
  ...utils.getAppProps(getIssue),
  key: "linear-get-issue",
  description: "Retrieves a Linear issue by its ID. Returns complete issue details including title, description, state, assignee, team, project, labels, and timestamps. Uses OAuth authentication. See Linear docs for additional info [here](https://linear.app/developers/graphql).",
  version: "0.1.14",
};
