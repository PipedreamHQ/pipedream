import { axios } from "@pipedream/platform";
import waitlist from "../../waitlist.app.mjs";

export default {
  key: "waitlist-new-subscriber",
  name: "New Subscriber Added",
  description: "Emit a new event each time a subscriber is added. [See the documentation](https://getwaitlist.com/docs/api-docs/waitlist)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    waitlist,
    db: "$.service.db",
    listId: {
      propDefinition: [
        waitlist,
        "listId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getLastSubscriberId() {
      return this.db.get("lastSubscriberId");
    },
    _setLastSubscriberId(lastSubscriberId) {
      this.db.set("lastSubscriberId", lastSubscriberId);
    },
    async _getSubscribers() {
      const listDetails = await this.waitlist.getListDetails({
        listId: this.listId,
      });
      return listDetails.signups || [];
    },
  },
  hooks: {
    async deploy() {
      const subscribers = await this._getSubscribers();
      const lastSubscriber = subscribers[0];
      if (lastSubscriber) {
        this._setLastSubscriberId(lastSubscriber.uuid);
        subscribers.slice(0, 50).forEach((subscriber) => {
          this.$emit(subscriber, {
            id: subscriber.uuid,
            summary: `New subscriber added: ${subscriber.email}`,
            ts: new Date(subscriber.created_at).getTime(),
          });
        });
      }
    },
    async activate() {
      console.log("Source activated");
    },
    async deactivate() {
      console.log("Source deactivated");
    },
  },
  async run() {
    const lastSubscriberId = this._getLastSubscriberId();
    const subscribers = await this._getSubscribers();
    const newSubscribers = [];

    for (const subscriber of subscribers) {
      if (subscriber.uuid === lastSubscriberId) break;
      newSubscribers.push(subscriber);
    }

    if (newSubscribers.length > 0) {
      this._setLastSubscriberId(newSubscribers[0].uuid);
      newSubscribers.reverse().forEach((subscriber) => {
        this.$emit(subscriber, {
          id: subscriber.uuid,
          summary: `New subscriber added: ${subscriber.email}`,
          ts: new Date(subscriber.created_at).getTime(),
        });
      });
    }
  },
};
