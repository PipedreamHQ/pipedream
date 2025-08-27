import component from "@pipedream/slack/actions/set-channel-description/set-channel-description.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-set-channel-description",
  description: "Change the description or purpose of a channel (Bot). [See the documentation](https://api.slack.com/methods/conversations.setPurpose)",
  version: "0.0.3",
};
