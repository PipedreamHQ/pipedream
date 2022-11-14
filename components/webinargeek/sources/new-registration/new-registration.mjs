import webinargeek from "../../webinargeek.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Registration",
  version: "0.0.2",
  key: "webinargeek-new-registration",
  description: "Emit new event on each new registration.",
  type: "source",
  dedupe: "unique",
  props: {
    webinargeek,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(body) {
      const data = body?.entity ?? body;

      this._setLastSubscriptionId(data.id);

      this.$emit(data, {
        id: data.id,
        summary: `New registration with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    _setLastSubscriptionId(id) {
      this.db.set("lastSubscriptionId", id);
    },
    _getLastSubscriptionId() {
      return this.db.get("lastSubscriptionId");
    },
  },
  hooks: {
    async deploy() {
      const subscriptions = await this.webinargeek.getSubscriptions({
        params: {
          per_page: 10,
        },
      });

      subscriptions.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    const lastSubscriptionId = this._getLastSubscriptionId();

    let page = 1;

    while (page >= 0) {
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
  },
};
