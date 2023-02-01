import component from "../../../slack/actions/list-user-groups-users/list-user-groups-users.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-list-user-groups-users",
  description: "List all users in a User Group (Bot). [See docs here](https://api.slack.com/methods/usergroups.users.list)",
  version: "0.0.1",
};
