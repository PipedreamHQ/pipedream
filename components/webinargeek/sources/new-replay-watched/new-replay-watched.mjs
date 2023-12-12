import webinargeek from "../../webinargeek.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Replay Watched",
  version: "0.0.3",
  key: "webinargeek-new-replay-watched",
  description: "Emit new event on each replay is watched.",
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
        summary: `New replay watched for a subscription with id ${data.id}`,
        ts: Date.parse(data.watch_start_replay),
      });
    },
  },
  hooks: {
    async deploy() {
      const subscriptions = await this.webinargeek.getSubscriptions({
        params: {
          per_page: 10,
          watched_replay: true,
        },
      });

      subscriptions.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 1;

    while (page >= 0) {
      const subscriptions = await this.webinargeek.getSubscriptions({
        params: {
          page,
          per_page: 100,
          watched_replay: true,
        },
      });

      subscriptions.reverse().forEach(this.emitEvent);

      if (subscriptions.length < 100) {
        return;
      }

      page++;
    }
  },
};
