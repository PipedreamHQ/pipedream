import createIssue from "@pipedream/linear_app/actions/create-issue/create-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createIssue,
  ...utils.getAppProps(createIssue),
  key: "linear-create-issue",
  description: "Creates a new issue in Linear. Requires team ID and title. Optional: description, assignee, project, state. Returns response object with success status and issue details. Uses OAuth authentication. See Linear docs for additional info [here](https://linear.app/developers/graphql#creating-and-editing-issues).",
  version: "0.4.12",
};
