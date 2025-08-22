import component from "@pipedream/slack/actions/add-emoji-reaction/add-emoji-reaction.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-add-emoji-reaction",
  description: "Add an emoji reaction to a message. [See the documentation](https://api.slack.com/methods/reactions.add)",
  version: "0.0.3",
};
