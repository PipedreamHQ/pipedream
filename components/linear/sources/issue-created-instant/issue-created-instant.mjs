import issueCreatedInstant from "@pipedream/linear_app/sources/issue-created-instant/issue-created-instant.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...issueCreatedInstant,
  ...utils.getAppProps(issueCreatedInstant),
  key: "linear-issue-created-instant",
  description: "Emit new event when a new issue is created (OAuth). [See the documentation](https://developers.linear.app/docs/graphql/webhooks)",
  version: "0.3.11",
};
