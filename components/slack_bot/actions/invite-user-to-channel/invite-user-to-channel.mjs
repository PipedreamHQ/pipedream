import component from "@pipedream/slack/actions/invite-user-to-channel/invite-user-to-channel.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-invite-user-to-channel",
  description: "Invite a user to an existing channel (Bot). [See the documentation](https://api.slack.com/methods/conversations.invite)",
  version: "0.0.5",
};
