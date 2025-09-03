import component from "@pipedream/slack/actions/update-group-members/update-group-members.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-update-group-members",
  description: "Update the list of users for a User Group (Bot). [See docs here](https://api.slack.com/methods/usergroups.users.update)",
  version: "0.0.3",
};
