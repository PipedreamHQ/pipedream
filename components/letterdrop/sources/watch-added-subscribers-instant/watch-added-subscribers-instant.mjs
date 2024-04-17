import { axios } from "@pipedream/platform";
import letterdrop from "../../letterdrop.app.mjs";

export default {
  key: "letterdrop-watch-added-subscribers-instant",
  name: "Watch Added Subscribers (Instant)",
  description: "Emits an event when a new email is added to the list of subscribers on Letterdrop. [See the documentation](https://letterdrop.com/docs/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    letterdrop,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch the most recent subscribers during the first run
      const response = await this.letterdrop.getSubscribers();
      const subscribers = response.subscribers || [];
      const lastFiftySubscribers = subscribers.slice(-50);
      for (const subscriber of lastFiftySubscribers) {
        this.$emit(subscriber, {
          id: subscriber.id,
          summary: `New subscriber: ${subscriber.email}`,
          ts: Date.parse(subscriber.created_at),
        });
      }
      this.db.set("lastProcessedTimestamp", lastFiftySubscribers.length > 0
        ? lastFiftySubscribers[0].created_at
        : null);
    },
  },
  methods: {
    ...letterdrop.methods,
  },
  async run() {
    const lastProcessedTimestamp = this.db.get("lastProcessedTimestamp");
    const response = await this.letterdrop.getSubscribers({
      lastProcessedTimestamp,
    });
    const subscribers = response.subscribers || [];

    subscribers.forEach((subscriber) => {
      if (new Date(subscriber.created_at) > new Date(lastProcessedTimestamp)) {
        this.$emit(subscriber, {
          id: subscriber.id,
          summary: `New subscriber: ${subscriber.email}`,
          ts: Date.parse(subscriber.created_at),
        });
      }
    });

    if (subscribers.length > 0) {
      this.db.set("lastProcessedTimestamp", subscribers[0].created_at);
    }
  },
};
