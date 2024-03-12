import sendloop from "../../sendloop.app.mjs";

export default {
  key: "sendloop-new-subscriber-instant",
  name: "New Subscriber Instant",
  description: "Emits an event when a new subscriber is added to the list. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    sendloop,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    emailAddress: {
      propDefinition: [
        sendloop,
        "emailAddress",
      ],
    },
    listId: {
      propDefinition: [
        sendloop,
        "listId",
      ],
    },
    addedTime: {
      propDefinition: [
        sendloop,
        "addedTime",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Get the last 50 subscribers
      const subscribers = await this.sendloop.getSubscribers(this.listId);
      if (subscribers.length > 50) {
        subscribers.length = 50;
      }

      // Emit the subscribers
      for (const subscriber of subscribers) {
        this.$emit(subscriber, {
          id: subscriber.id,
          summary: `New Subscriber: ${subscriber.emailAddress}`,
          ts: subscriber.addedTime
            ? +new Date(subscriber.addedTime)
            : +new Date(),
        });
      }
    },
  },
  async run() {
    // Get the latest subscribers
    const subscribers = await this.sendloop.getSubscribers(this.listId);

    // Filter out any subscribers that were added before the last check
    const newSubscribers = subscribers.filter((subscriber) => {
      return subscriber.addedTime && +new Date(subscriber.addedTime) > +new Date(this.addedTime);
    });

    // If there are new subscribers, update the addedTime prop to the addedTime of the latest subscriber
    if (newSubscribers.length > 0) {
      this.addedTime = newSubscribers[0].addedTime;
    }

    // Emit the new subscribers
    for (const subscriber of newSubscribers) {
      this.$emit(subscriber, {
        id: subscriber.id,
        summary: `New Subscriber: ${subscriber.emailAddress}`,
        ts: +new Date(subscriber.addedTime),
      });
    }
  },
};
