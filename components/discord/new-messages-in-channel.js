// Discord Bot app file
const discord = require("https://github.com/PipedreamHQ/pipedream/components/discord/discord.app.js");
const maxBy = require("lodash.maxby");

module.exports = {
  name: "New Messages in Channel",
  version: "0.0.4",
  dedupe: "unique", // Dedupe events based on the Discord message ID
  props: {
    db: "$.service.db",
    discord,
    guild: { propDefinition: [discord, "guild"] },
    channels: {
      type: "string[]",
      label: "Channels",
      description: "The channels you'd like to watch for new messages",
      async options() {
        return await this.discord.getChannels(this.guild);
      },
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
        intervalSeconds: 60,
      },
    },
  },
  async run() {
    // We store a cursor to the last message ID
    let lastMessageIDs = this.db.get("lastMessageIDs") || {};

    // If this is our first time running this source,
    // get the last N messages, emit them, and checkpoint
    for (const channel of this.channels) {
      let lastMessageID;
      let messages = [];
      if (!lastMessageID) {
        messages = await this.discord.getMessages(channel, null, 100);
        lastMessageID = messages.length
          ? maxBy(messages, (message) => message.id).id
          : 1;
      } else {
        let newMessages = [];
        do {
          newMessages = await this.discord.getMessages(
            channel,
            lastMessageIDs[channel]
          );
          messages = messages.concat(newMessages);
          lastMessageID = newMessages.length
            ? maxBy(newMessages, (message) => message.id).id
            : lastMessageIDs[channel];
        } while (newMessages.length);
      }

      // Set the new high water mark for the last message ID
      // for this channel
      lastMessageIDs[channel] = lastMessageID;

      if (!messages.length) {
        console.log(`No new messages in channel ${channel}`);
        return;
      }

      console.log(`${messages.length} new messages in channel ${channel}`);

      // Batched emits do not take advantage of the built-in deduper
      if (this.emitEventsInBatch) {
        this.$emit(messages, {
          summary: `${messages.length} new message${
            messages.length > 1 ? "s" : ""
          }`,
          id: lastMessageID,
        });
      } else {
        for (const message of messages) {
          this.$emit(message, {
            summary: message.content,
            id: message.id, // dedupes events based on this ID
          });
        }
      }
    }

    // Set the last message ID for the next run
    this.db.set("lastMessageIDs", lastMessageIDs);
  },
};
