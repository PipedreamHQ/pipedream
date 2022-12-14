import component from "../../../slack/actions/create-channel/create-channel.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-create-channel",
  description: "Create a new channel (Bot). [See docs here](https://api.slack.com/methods/conversations.create)",
  version: "0.0.1",
};
