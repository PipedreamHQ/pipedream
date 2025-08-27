import component from "@pipedream/slack/actions/send-message-advanced/send-message-advanced.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
    omitProps: [
      "as_user",
    ],
  }),
  key: "slack_bot-send-message-advanced",
  description: "Customize advanced setttings and send a message to a channel, group or user (Bot). See [postMessage](https://api.slack.com/methods/chat.postMessage) or [scheduleMessage](https://api.slack.com/methods/chat.scheduleMessage) docs here",
  version: "0.0.6",
};
