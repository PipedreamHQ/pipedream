import webinargeek from "../../webinargeek.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Unsubscribed",
  version: "0.0.3",
  key: "webinargeek-new-unsubscribed",
  description: "Emit new event on each new unsubscribed.",
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

      this.$emit(data, {
        id: data.id,
        summary: `New unsubscribed with id ${data.id}`,
        ts: Date.parse(data.unsubscribed_at),
      });
    },
  },
  hooks: {
    async deploy() {
      const unsubscriptions = await this.webinargeek.getSubscriptions({
        params: {
          per_page: 10,
          unsubscribed: true,
        },
      });

      unsubscriptions.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 1;

    while (page >= 0) {
      const unsubscriptions = await this.webinargeek.getSubscriptions({
        params: {
          page,
          per_page: 100,
          unsubscribed: true,
        },
      });

      unsubscriptions.reverse().forEach(this.emitEvent);

      if (unsubscriptions.length < 100) {
        return;
      }

      page++;
    }
  },
};
