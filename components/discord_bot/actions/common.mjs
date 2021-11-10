import maxBy from "lodash.maxby";
import common from "../common.mjs";
import constants from "../constants.mjs";

const { discord } = common.props;

export default {
  ...common,
  methods: {
    async paginateMessages({
      $, channelId, before, after, around,
      limit = constants.DEFAULT_PAGE_LIMIT,
      max = constants.DEFAULT_MAX_ITEMS,
    }) {
      const hasFilter = before || after || around;
      let messages = [];
      let nextMessages = [];
      let lastId;

      do {
        const lastLimit = max - messages.length;

        const params = !messages.length && hasFilter
          ? {
            limit,
            before,
            after,
            around,
          }
          : {
            limit: lastLimit < limit
              ? lastLimit
              : limit,
            before: lastId,
          };

        nextMessages = await this.discord.getMessages({
          $,
          channelId,
          params,
        });

        if (!limit) {
          limit = nextMessages.length;
        }

        const lastMessage = maxBy(nextMessages, (message) => message.id);

        lastId = lastMessage?.id;
        messages = messages.concat(nextMessages);

      } while (nextMessages.length && messages.length < max);

      return messages;
    },
  },
  props: {
    ...common.props,
    channelId: {
      propDefinition: [
        discord,
        "channelId",
        ({ guildId }) => ({
          guildId,
          notAllowedChannels: constants.NOT_ALLOWED_CHANNELS,
        }),
      ],
    },
  },
};
