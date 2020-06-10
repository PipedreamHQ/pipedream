// Discord Bot app file
const discord = require("https://github.com/PipedreamHQ/pipedream/components/discord/discord.app.js");
const maxBy = require("lodash.maxby");

module.exports = {
  name: "New Messages in Channels",
  version: "0.0.1",
  dedupe: "unique", // Dedupe events based on the Discord message ID
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
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
  },
  async run() {
    // We store a cursor to the last message ID
    let lastMessageID = this.db.get("lastMessageID");

    // If this is our first time running this source,
    // get the most recent message ID and exit
    if (!lastMessageID) {
      this.db.set(
        "lastMessageID",
        await this.discord.getLastMessageID(this.channel)
      );
      return;
    }

    let messages = [];
    let newMessages = [];
    do {
      newMessages = await this.discord.getMessagesSinceID(
        this.channel,
        lastMessageID
      );
      console.log(newMessages);
      messages = messages.concat(newMessages);
      lastMessageID = newMessages.length
        ? maxBy(newMessages, (message) => message.id).id
        : lastMessageID;
    } while (newMessages.length);

    if (!messages.length) {
      console.log(`No new messages in channel ${this.channel}`);
      return;
    }

    console.log(`${messages.length} new messages in channel ${this.channel}`);

    // Batched emits do not take advantage of the built-in deduper
    console.log(messages);
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

    // Finally, set the last message ID for the next run
    this.db.set("lastMessageID", lastMessageID);
  },
};
