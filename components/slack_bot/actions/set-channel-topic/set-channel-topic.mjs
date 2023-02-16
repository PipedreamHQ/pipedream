import component from "../../../slack/actions/set-channel-topic/set-channel-topic.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-set-channel-topic",
  description: "Set the topic on a selected channel (Bot). [See docs here](https://api.slack.com/methods/conversations.setTopic)",
  version: "0.0.1",
};
