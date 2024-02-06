import gotowebinar from "../../gotowebinar.app.mjs";

export default {
  props: {
    gotowebinar,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { _embedded } = await this.gotowebinar.createHook({
        data: [
          {
            callbackUrl: this.http.endpoint,
            eventName: this.getEventName(),
            eventVersion: "1.0.0",
            product: "g2w",
          },
        ],
      });

      this._setHookId(_embedded.webhooks[0].webhookKey);

      await this.delay(2000);

      await this.gotowebinar.updateHook({
        data: [
          {
            webhookKey: _embedded.webhooks[0].webhookKey,
            state: "ACTIVE",
          },
        ],
      });

      const { _embedded: userSubscription } = await this.gotowebinar.createUserSubscription({
        data: [
          {
            callbackUrl: this.http.endpoint,
            webhookKey: _embedded.webhooks[0].webhookKey,
            userSubscriptionState: "ACTIVE",
          },
        ],
      });

      this._setUserSubscriptionId(userSubscription.userSubscriptions[0].userSubscriptionKey);

    },
    async deactivate() {
      const id = this._getHookId("hookId");
      await this.gotowebinar.deleteHook({
        data: [
          id,
        ],
      });
      const userSubscriptionId = this._getUserSubscriptionId("userSubscriptionId");
      await this.gotowebinar.deleteUserSubscription({
        data: [
          userSubscriptionId,
        ],
      });
    },
  },
  methods: {
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    _setUserSubscriptionId(userSubscriptionId) {
      this.db.set("userSubscriptionId", userSubscriptionId);
    },
    _getUserSubscriptionId() {
      return this.db.get("userSubscriptionId");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    emitEvent(body) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    },
    delay(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },

  },
  async run({ body }) {
    if (!body) return;

    this.emitEvent(body);
  },
};
