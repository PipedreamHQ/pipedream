import component from "../../../slack/actions/unarchive-channel/unarchive-channel.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

// Bug reported at https://api.slack.com/methods/conversations.unarchive#markdown
// Bot tokens (xoxb-...) cannot currently be used to unarchive conversations.
// For now, please use a user token (xoxp-...) to unarchive
// the conversation rather than a bot token.

export default {
  ...component,
  props: utils.buildAppProps({
    component,
    addedProps: {
      conversation: {
        propDefinition: [
          undefined,
          "channelId",
          () => ({
            types: [
              constants.CHANNEL_TYPE.PUBLIC,
              constants.CHANNEL_TYPE.PRIVATE,
              constants.CHANNEL_TYPE.MPIM,
            ],
            excludeArchived: false,
            channelsFilter: (channel) => channel.is_archived,
          }),
        ],
      },
    },
  }),
  key: "slack_bot-unarchive-channel",
  description: "Unarchive a channel (Bot). [See docs here](https://api.slack.com/methods/conversations.unarchive)",
  version: "0.0.1",
};
