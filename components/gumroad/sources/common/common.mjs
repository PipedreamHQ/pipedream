import gumroad from "../../gumroad.app.mjs";

export default {
  props: {
    gumroad,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  methods: {
    emitEvent(data) {
      throw new Error('emitEvent is not implemented', data)
    },
    getResources() {
      throw new Error('getResources is not implemented')
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", id);
    },
    _getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
  },
  hooks: {
    async deploy() {
      const resources = await this.getResources();

      resources.slice(10).reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    const page = 0

    while (true) {
      const subscriptions = await this.webinargeek.getSubscriptions({
        params: {
          page,
          per_page: 100,
        },
      });

      subscriptions.reverse().forEach(this.emitEvent);

      if (
        subscriptions.length < 100 ||
        subscriptions.filter((subscription) => subscription.id === lastSubscriptionId)
      ) {
        return;
      }

      page++;
    }
    while (true) {

    }
    const resources = await this.getResources();

    resources.reverse().forEach(this.emitEvent);
  },
};
