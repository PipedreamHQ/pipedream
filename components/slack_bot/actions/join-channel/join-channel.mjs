import component from "../../../slack/actions/join-channel/join-channel.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-join-channel",
  description: "Join an existing channel (Bot). [See docs here](https://api.slack.com/methods/conversations.join)",
  version: "0.0.1",
};
