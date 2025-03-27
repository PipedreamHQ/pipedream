import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import quriiri from "../../quriiri.app.mjs";

export default {
  key: "quriiri-new-message",
  name: "New Quriiri Message",
  description: "Emit a new event when a message is received at a specific phone number. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    quriiri,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    destinationPhoneNumber: {
      type: "string",
      label: "Destination Phone Number",
      description: "The specific phone number to monitor for incoming messages.",
    },
  },
  hooks: {
    async deploy() {
      const destinationPhoneNumber = this.destinationPhoneNumber;
      const messages = await this.quriiri.paginate(this.quriiri.listIncomingMessages);
      const filteredMessages = messages.filter(
        (msg) => msg.destination === destinationPhoneNumber,
      );
      const sortedMessages = filteredMessages.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );
      const recentMessages = sortedMessages.slice(0, 50).reverse();
      for (const message of recentMessages) {
        this.$emit(message, {
          id: message.id || new Date(message.timestamp).getTime(),
          summary: `New message from ${message.sender}`,
          ts: new Date(message.timestamp).getTime(),
        });
      }
      const latestTimestamp = recentMessages.reduce(
        (max, msg) => (new Date(msg.timestamp).getTime() > max
          ? new Date(msg.timestamp).getTime()
          : max),
        0,
      );
      await this.db.set("lastTimestamp", latestTimestamp);
    },
    async activate() {
      // Activation logic can be added here if necessary
    },
    async deactivate() {
      // Deactivation logic can be added here if necessary
    },
  },
  async run() {
    const destinationPhoneNumber = this.destinationPhoneNumber;
    const lastTimestamp = (await this.db.get("lastTimestamp")) || 0;
    const messages = await this.quriiri.listIncomingMessages({
      since: lastTimestamp,
    });
    const filteredMessages = messages.filter(
      (msg) => msg.destination === destinationPhoneNumber,
    );
    for (const message of filteredMessages) {
      this.$emit(message, {
        id: message.id || new Date(message.timestamp).getTime(),
        summary: `New message from ${message.sender}`,
        ts: message.timestamp
          ? new Date(message.timestamp).getTime()
          : Date.now(),
      });
    }
    if (filteredMessages.length > 0) {
      const latestTimestamp = filteredMessages.reduce(
        (max, msg) => (new Date(msg.timestamp).getTime() > max
          ? new Date(msg.timestamp).getTime()
          : max),
        lastTimestamp,
      );
      await this.db.set("lastTimestamp", latestTimestamp);
    }
  },
};
