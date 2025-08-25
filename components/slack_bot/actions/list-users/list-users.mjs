import component from "@pipedream/slack/actions/list-users/list-users.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-list-users",
  description: "Return a list of all users in a workspace (Bot). [See the documentation](https://api.slack.com/methods/users.list)",
  version: "0.0.5",
};
