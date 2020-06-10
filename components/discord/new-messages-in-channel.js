// Discord Bot app file
const discord = require("https://github.com/PipedreamHQ/pipedream/components/discord/discord.app.js");
const maxBy = require("lodash.maxby");

module.exports = {
  name: "New Messages in Channel",
  version: "0.0.2",
  dedupe: "unique", // Dedupe events based on the Discord message ID
  props: {
    db: "$.service.db",
    discord,
    guild: { propDefinition: [discord, "guild"] },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel you'd like to watch for new messages",
      async options() {
        return await this.discord.getChannels(this.guild);
      },
    },
    emitEventsInBatch: {
      type: "boolean",
      label: "Emit changes as a single event",
      description:
        "If `true`, all events are emitted as an array, within a single Pipedream event. Defaults to `false`, emitting each event in Fauna as its own event in Pipedream",
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
    let lastMessageID = this.db.get("lastMessageID");

    let messages = [];

    // If this is our first time running this source,
    // get the last 100 messages, emit them, and checkpoint
    if (!lastMessageID) {
      messages = await this.discord.getMessages(this.channel, null, 100);
      lastMessageId = messages.length
        ? maxBy(messages, (message) => message.id).id
        : 1;
    } else {
      let newMessages = [];
      do {
        newMessages = await this.discord.getMessages(
          this.channel,
          lastMessageID
        );
        messages = messages.concat(newMessages);
        lastMessageID = newMessages.length
          ? maxBy(newMessages, (message) => message.id).id
          : lastMessageID;
      } while (newMessages.length);
    }

    // Set the last message ID for the next run
    this.db.set("lastMessageID", lastMessageID);

    if (!messages.length) {
      console.log(`No new messages in channel ${this.channel}`);
      return;
    }

    console.log(`${messages.length} new messages in channel ${this.channel}`);

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
  },
};
