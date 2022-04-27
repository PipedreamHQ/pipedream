import common from "../common/webhook-props.mjs";
import issueCreatedInstant from "../../../linear_app/sources/issue-created-instant/issue-created-instant.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...issueCreatedInstant,
  key: "linear-issue-created-instant",
  description: "Emit new event when a new issue is created (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/webhooks)",
  version: "0.1.0",
  props: {
    ...common.props,
  },
};
