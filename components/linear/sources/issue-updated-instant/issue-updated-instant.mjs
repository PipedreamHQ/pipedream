import issueUpdatedInstant from "@pipedream/linear_app/sources/issue-updated-instant/issue-updated-instant.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...issueUpdatedInstant,
  ...utils.getAppProps(issueUpdatedInstant),
  key: "linear-issue-updated-instant",
  description: "Emit new event when an issue is updated (OAuth). See the documentation](https://developers.linear.app/docs/graphql/webhooks)",
  version: "0.3.11",
};
