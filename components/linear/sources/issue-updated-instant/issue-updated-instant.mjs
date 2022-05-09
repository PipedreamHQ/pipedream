import common from "../common/webhook-props.mjs";
import issueUpdatedInstant from "../../../linear_app/sources/issue-updated-instant/issue-updated-instant.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...issueUpdatedInstant,
  key: "linear-issue-updated-instant",
  description: "Emit new event when an issue is updated (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/webhooks)",
  version: "0.1.0",
  props: {
    ...common.props,
  },
};
