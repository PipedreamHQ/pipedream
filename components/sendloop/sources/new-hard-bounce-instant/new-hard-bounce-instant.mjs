import sendloop from "../../sendloop.app.mjs";

export default {
  key: "sendloop-new-hard-bounce-instant",
  name: "New Hard Bounce Instant",
  description: "Emits an event when a subscriber's status changes to 'hard bounce'.",
  version: "0.0.1",
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
  },
  methods: {
    generateMeta(data) {
      const {
        id, ts,
      } = data;
      return {
        id,
        summary: `New hard bounce for subscriber: ${this.emailAddress}`,
        ts,
      };
    },
  },
  async run() {
    const subscriber = await this.sendloop.getSubscriber(this.emailAddress, this.listId);
    if (subscriber.bounceStatus === "hard bounce") {
      const meta = this.generateMeta(subscriber);
      this.$emit(subscriber, meta);
    }
  },
};
