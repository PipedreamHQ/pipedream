import userlist from "../../userlist.app.mjs";

export default {
  key: "userlist-new-user-subscribed-instant",
  name: "New User Subscribed (Instant)",
  description: "Emits an event when a new user subscribes to messages",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    userlist,
    db: "$.service.db",
    userId: {
      propDefinition: [
        userlist,
        "userId",
      ],
    },
    email: {
      propDefinition: [
        userlist,
        "email",
      ],
    },
    additionalContext: {
      propDefinition: [
        userlist,
        "additionalContext",
      ],
    },
  },
  hooks: {
    async activate() {
      const data = {
        name: "subscribed",
        user: this.userId || this.email,
        properties: this.additionalContext,
      };
      await this.userlist.emitSubscriptionEvent(data);
    },
  },
  methods: {
    isRelevant(body) {
      return body.name === "subscribed" && (body.user === this.userId || body.user === this.email);
    },
    _getSubscriptionEvent() {
      return this.db.get("subscriptionEvent") || null;
    },
    _setSubscriptionEvent(subscriptionEvent) {
      this.db.set("subscriptionEvent", subscriptionEvent);
    },
  },
  async run() {
    const previousSubscriptionEvent = this._getSubscriptionEvent();
    const subscriptionEvent = await this.userlist.emitSubscriptionEvent({
      userId: this.userId,
      email: this.email,
      additionalContext: this.additionalContext,
    });

    if (subscriptionEvent !== previousSubscriptionEvent) {
      this.$emit(subscriptionEvent, {
        id: subscriptionEvent.id,
        summary: `New Subscription Event: ${subscriptionEvent.name}`,
        ts: Date.now(),
      });
      this._setSubscriptionEvent(subscriptionEvent);
    }
  },
};
