import component from "../../../slack/actions/leave-channel/leave-channel.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-leave-channel",
  description: "Leave an existing channel (Bot). [See docs here](https://api.slack.com/methods/conversations.leave)",
  version: "0.0.1",
};
