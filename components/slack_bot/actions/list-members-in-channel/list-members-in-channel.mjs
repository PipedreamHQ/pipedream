import component from "@pipedream/slack/actions/list-members-in-channel/list-members-in-channel.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
    omitProps: [
      "conversation",
    ],
    addedProps: {
      conversation: {
        propDefinition: [
          undefined,
          "conversation",
          () => ({
            types: [
              constants.CHANNEL_TYPE.PUBLIC,
              constants.CHANNEL_TYPE.PRIVATE,
              constants.CHANNEL_TYPE.MPIM,
            ],
          }),
        ],
      },
    },
  }),
  key: "slack_bot-list-members-in-channel",
  description: "Retrieve members of a channel (Bot). [See the documentation](https://api.slack.com/methods/conversations.members)",
  version: "0.0.5",
};
