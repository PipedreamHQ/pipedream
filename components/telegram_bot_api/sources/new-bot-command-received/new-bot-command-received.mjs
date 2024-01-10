import base from "../common/webhooks.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "telegram_bot_api-new-bot-command-received",
  name: "New Bot Command Received (Instant)",
  description: "Emit new event each time a Telegram Bot command is received.",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    commands: {
      propDefinition: [
        base.props.telegramBotApi,
        "commands",
      ],
    },
  },
  methods: {
    ...base.methods,
    getMeta(event, message) {
      return {
        id: event.update_id,
        summary: message.text,
        ts: new Date(message.edit_date ?? message.date),
      };
    },
    getEventTypes() {
      return [
        "message",
        "edited_message",
      ];
    },
    processEvent(event) {
      const message = event.edited_message ?? event.message;

      if (!message?.text) {
        console.log("Skipping message that isn’t a bot command");

        return;
      }

      const command = message.text.split(" ")[0];

      if (typeof this.commands === "string") {
        this.commands = JSON.parse(this.commands);
      }

      const foundCmd = this.commands.some((cmd) => command.includes(cmd));
      if (!foundCmd) {
        return;
      }

      this.$emit(event, this.getMeta(event, message));
    },
  },
  sampleEmit,
};
