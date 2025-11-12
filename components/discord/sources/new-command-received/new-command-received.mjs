import discord from "../../discord.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  type: "source",
  key: "discord-new-command-received",
  name: "New Command Received (Instant)",
  description: "Emit new event for each command posted to one or more channels in a Discord server",
  version: "0.0.4",
  dedupe: "unique",
  props: {
    discord,
    channels: {
      type: "$.discord.channel[]",
      appProp: "discord",
      label: "Channels",
      description: "Select the channel(s) you'd like to be notified for",
    },
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    discordApphook: {
      type: "$.interface.apphook",
      appProp: "discord",
      async eventNames() {
        return this.channels || [];
      },
    },
    commands: {
      label: "Commands",
      description: "List of commands to listen. E.g. `[\"/hi\", \"/hello\"]`",
      type: "string[]",
    },
  },
  async run(event) {
    if (event.guildID != this.discord.$auth.guild_id) {
      return;
    }

    const command = event.content.split(" ")[0];

    if (typeof this.commands === "string") {
      this.commands = JSON.parse(this.commands);
    }

    if (!this.commands.includes(command)) {
      return;
    }

    this.$emit(event, {
      id: event.id,
      summary: `New command posted with ID ${event.id}`,
      ts: Date.parse(event.createdTimestamp),
    });
  },
  sampleEmit,
};
