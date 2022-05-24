import maxBy from "lodash.maxby";
import common from "../common.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-new-message-in-channel",
  name: "New Message in Channel",
  description: "Emit new event for each message posted to one or more channels",
  type: "source",
  version: "0.0.5",
  dedupe: "unique", // Dedupe events based on the Discord message ID
  props: {
    ...common.props,
    db: "$.service.db",
    channels: {
      type: "string[]",
      label: "Channels",
      description: "The channels you'd like to watch for new messages",
      propDefinition: [
        discord,
        "channelId",
        ({ guildId }) => ({
          guildId,
        }),
      ],
    },
    emitEventsInBatch: {
      type: "boolean",
      label: "Emit messages as a single event",
      description:
        "If `true`, all messages are emitted as an array, within a single Pipedream event. Defaults to `false`, emitting each Discord message as its own event in Pipedream",
      optional: true,
      default: false,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run({ $ }) {
    // We store a cursor to the last message ID
    let lastMessageIDs = this._getLastMessageIDs();

    // If this is our first time running this source,
    // get the last N messages, emit them, and checkpoint
    for (const channelId of this.channels) {
      let lastMessageID;
      let messages = [];

      if (!lastMessageID) {
        messages = await this.discord.getMessages({
          $,
          channelId,
          params: {
            limit: 100,
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

        } while (newMessages.length);
      }

      // Set the new high water mark for the last message ID
      // for this channel
      lastMessageIDs[channelId] = lastMessageID;

      if (!messages.length) {
        console.log(`No new messages in channel ${channelId}`);
        return;
      }

      console.log(`${messages.length} new messages in channel ${channelId}`);

      // Batched emits do not take advantage of the built-in deduper
      if (this.emitEventsInBatch) {
        const suffixChar =
          messages.length > 1
            ? "s"
            : "";

        this.$emit(messages, {
          summary: `${messages.length} new message${suffixChar}`,
          id: lastMessageID,
        });

      } else {
        messages.forEach((message) => {
          this.$emit(message, {
            summary: message.content,
            id: message.id, // dedupes events based on this ID
          });
        });
      }
    }

    // Set the last message ID for the next run
    this._setLastMessageIDs(lastMessageIDs);
  },
};
