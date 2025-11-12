import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import maxBy from "lodash.maxby";
import constants from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "discord_bot-new-forum-thread-message",
  name: "New Forum Thread Message",
  description: "Emit new event for each forum thread message posted. Note that your bot must have the `MESSAGE_CONTENT` privilege intent to see the message content. [See the documentation](https://discord.com/developers/docs/topics/gateway#message-content-intent).",
  type: "source",
  version: "1.0.1",
  dedupe: "unique", // Dedupe events based on the Discord message ID
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    forumId: {
      propDefinition: [
        common.props.discord,
        "channelId",
        ({ guildId }) => ({
          guildId,
          allowedChannels: [
            constants.CHANNEL_TYPES.GUILD_FORUM,
          ],
        }),
      ],
      label: "Forum Id",
      description: "Select the forum you want to watch.",
    },
    ignoreBotMessages: {
      type: "boolean",
      label: "Ignore Bot Messages",
      description: "Set to `true` to only emit messages NOT from the configured Discord bot",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      if (this.ignoreBotMessages) {
        const { id } = await this.getBotProfile();
        this._setBotId(id);
      }
    },
  },
  methods: {
    ...common.methods,
    getChannel(id) {
      return this.discord._makeRequest({
        path: `/channels/${id}`,
      });
    },
  },
  async run({ $ }) {
    // We store a cursor to the last message ID
    let lastMessageIDs = this._getLastMessageIDs();
    const botId = this.ignoreBotMessages
      ? this._getBotId()
      : null;

    const { threads } = await this.discord.listThreads({
      $,
      guildId: this.guildId,
    });

    const forumThreads = threads.reduce((acc, curr) => {
      return curr.parent_id === this.forumId ?
        [
          ...acc,
          curr,
        ]
        : acc;
    }, []);

    // If this is our first time running this source,
    // get the last N messages, emit them, and checkpoint
    for (const channel of forumThreads) {
      let lastMessageID;
      let messages = [];
      const channelId = channel.id;

      if (!lastMessageIDs[channelId]) {
        messages = await this.discord.getMessages({
          $,
          channelId,
          params: {
            limit: 25,
          },
        });

        lastMessageID = messages.length
          ? maxBy(messages, (message) => message.id).id
          : 1;

      } else {
        let newMessages = [];

        do {
          newMessages = await this.discord.getMessages({
            $,
            channelId,
            params: {
              after: lastMessageIDs[channelId],
            },
          });

          messages = messages.concat(newMessages);

          lastMessageID = newMessages.length
            ? maxBy(newMessages, (message) => message.id).id
            : lastMessageIDs[channelId];
          lastMessageIDs[channelId] = lastMessageID;

        } while (newMessages.length);
      }

      // Set the new high water mark for the last message ID
      // for this channel
      lastMessageIDs[channelId] = lastMessageID;

      if (!messages.length) {
        console.log(`No new messages in thread ${channelId}`);
        continue;
      }

      if (botId) {
        messages = messages.filter((message) => message.author.id !== botId);
      }

      console.log(`${messages.length} new messages in thread ${channelId}`);

      messages = await Promise.all(messages.map(async (message) => ({
        ...message,
        thread: await this.getChannel(message.channel_id),
      })));

      const { available_tags: availableTags = [] } = await this.getChannel(this.forumId);
      for (const message of messages) {
        if (!message.thread.applied_tags) {
          message.thread.applied_tags = [];
        }
        message.thread.applied_tags = message.thread.applied_tags.map((tagId) => ({
          ...availableTags.find(({ id }) => id === tagId),
        }));
      }

      messages.reverse().forEach((message) => {
        this.$emit(message, {
          id: message.id, // dedupes events based on this ID
          summary: `A new message with Id: ${message.id} was posted in forum thread ${channelId}.`,
          ts: Date.parse(message.timestamp),
        });
      });
    }

    // Set the last message ID for the next run
    this._setLastMessageIDs(lastMessageIDs);
  },
  sampleEmit,
};
