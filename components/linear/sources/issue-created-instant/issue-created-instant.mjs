import issueCreatedInstant from "@pipedream/linear_app/sources/issue-created-instant/issue-created-instant.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...issueCreatedInstant,
  ...utils.getAppProps(issueCreatedInstant),
  key: "linear-issue-created-instant",
  description: "Triggers instantly when a new issue is created in Linear. Provides complete issue details including title, description, team, assignee, state, and timestamps. Supports filtering by team and project. Uses OAuth authentication. See Linear docs for additional info [here](https://developers.linear.app/docs/graphql/webhooks).",
  version: "0.3.14",
};
