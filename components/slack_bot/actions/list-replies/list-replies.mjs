import component from "../../../slack/actions/list-replies/list-replies.mjs";
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
      "timestamp",
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
              constants.CHANNEL_TYPE.IM,
            ],
          }),
        ],
      },
      timestamp: {
        propDefinition: [
          undefined,
          "messageTs",
        ],
        optional: false,
      },
    },
  }),
  key: "slack_bot-list-replies",
  description: "Retrieve a thread of messages posted to a conversation (Bot). [See the documentation](https://api.slack.com/methods/conversations.replies)",
  version: "0.0.4",
};
