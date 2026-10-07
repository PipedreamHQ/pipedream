import createIssue from "@pipedream/linear_app/actions/create-issue/create-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createIssue,
  ...utils.getAppProps(createIssue),
  key: "linear-create-issue",
  description: "Creates a new issue in Linear. Requires a team ID and title; all other fields are optional. Use **Get Teams** to discover valid team IDs, **List Workflow States** to find state IDs, **List Users** to find assignee IDs, and **List Labels** to find label IDs. Example: `teamId: \"9d1c3f7e-2b48-4c6a-9f1e-5a7b8c9d0e1f\"`, `title: \"Fix login redirect on mobile\"` → returns `{success: true, issue: {id: \"iss_01\", identifier: \"ENG-42\", title: \"Fix login redirect on mobile\"}}`. [See the documentation](https://linear.app/developers/graphql#creating-and-editing-issues).",
  version: "0.4.17",
  ai: "optimized",
};
