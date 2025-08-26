import component from "@pipedream/slack/actions/list-group-members/list-group-members.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-list-group-members",
  description: "List all users in a User Group (Bot). [See the documentation](https://api.slack.com/methods/usergroups.users.list)",
  version: "0.0.3",
};
