import component from "@pipedream/slack/actions/find-user-by-email/find-user-by-email.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-find-user-by-email",
  description: "Find a user by matching against their email (Bot). [See the documentation](https://api.slack.com/methods/users.lookupByEmail)",
  version: "0.0.5",
};
