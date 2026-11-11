import createIssue from "@pipedream/linear_app/actions/create-issue/create-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createIssue,
  ...utils.getAppProps(createIssue),
  key: "linear-create-issue",
  description: "Creates a new issue in Linear. Use it when the user asks to file, open or create an issue; to change an existing issue, use **Update Issue** instead. Requires a team ID and title; all other fields are optional. Use **Get Teams** to discover valid team IDs, **List Workflow States** to find state IDs, **List Users** to find assignee IDs, and **List Labels** to find label IDs. To create a sub-issue, set `parentId` to the parent issue's ID (use **Search Issues** to find it). Returns the new issue's `id`, `identifier` (e.g. `ENG-42`), `title`, `url` and `state`, so no **Get Issue** call is needed to share or link it. Example: `teamId: \"9d1c3f7e-2b48-4c6a-9f1e-5a7b8c9d0e1f\"`, `title: \"Fix login redirect on mobile\"` → returns `{success: true, issue: {id: \"7df5e7f9-a357-4539-ae94-4a004fec635f\", identifier: \"ENG-42\", title: \"Fix login redirect on mobile\", url: \"https://linear.app/acme/issue/ENG-42/fix-login-redirect-on-mobile\", state: {name: \"Todo\"}}}`. [See the documentation](https://linear.app/developers/graphql#creating-and-editing-issues).",
  version: "0.5.0",
  ai: "optimized",
};
