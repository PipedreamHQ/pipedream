import component from "../../../slack/actions/list-members-in-channel/list-members-in-channel.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-list-members-in-channel",
  description: "Retrieve members of a channel (Bot). [See docs here](https://api.slack.com/methods/conversations.members)",
  version: "0.0.1",
};
