import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import maxBy from "lodash.maxby";
import constants from "../../common/constants.mjs";
import common from "../common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "discord_bot-new-forum-thread-message",
  name: "New Forum Thread Message",
  description: "Emit new event for each forum thread message posted. Note that your bot must have the `MESSAGE_CONTENT` privilege intent to see the message content, [see the docs here](https://discord.com/developers/docs/topics/gateway#message-content-intent).",
  type: "source",
  version: "0.0.2",
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
  },
  async run({ $ }) {
    // We store a cursor to the last message ID
    let lastMessageIDs = this._getLastMessageIDs();

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

      console.log(`${messages.length} new messages in thread ${channelId}`);

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
