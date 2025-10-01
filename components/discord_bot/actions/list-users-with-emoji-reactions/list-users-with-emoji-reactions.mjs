import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import common from "../common.mjs";

const { discord } = common.props;
const { emptyStrToUndefined } = utils;

export default {
  ...common,
  key: "discord_bot-list-users-with-emoji-reactions",
  name: "List Users that Reacted with Emoji",
  description: "Return a list of users that reacted with a specified emoji.",
  type: "action",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ...common.props,
    messageId: {
      propDefinition: [
        discord,
        "messageId",
      ],
    },
    decodedEmoji: {
      propDefinition: [
        discord,
        "emoji",
      ],
    },
    max: {
      propDefinition: [
        discord,
        "max",
      ],
    },
    limit: {
      default: 10,
      propDefinition: [
        discord,
        "limit",
      ],
    },
    after: {
      propDefinition: [
        discord,
        "after",
      ],
    },
  },
  async run({ $ }) {
    const {
      decodedEmoji,
      channelId,
      messageId,
    } = this;

    const limit = emptyStrToUndefined(this.limit);
    const after = emptyStrToUndefined(this.after);
    const max = emptyStrToUndefined(this.max);

    const emoji = encodeURIComponent(`${decodedEmoji}`);

    return this.paginateResources({
      resourceFn: this.discord.getUserReactions,
      resourceFnArgs: {
        $,
        channelId,
        emoji,
        messageId,
      },
      after,
      limit,
      max,
      paginationKey: constants.PAGINATION_KEY.AFTER,
    });
  },
};
