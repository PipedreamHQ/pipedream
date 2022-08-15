import webinargeek from "../../webinargeek.app.mjs";

export default {
  name: "New Webinar Watched",
  version: "0.0.1",
  key: "webinargeek-new-webinar-watched",
  description: "Emit new event on each webinar is watched.",
  type: "source",
  dedupe: "unique",
  props: {
    webinargeek,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  methods: {
    emitEvent(body) {
      const data = body?.entity ?? body;

      this.$emit(data, {
        id: data.id,
        summary: `New webinar watched for a subscription with id ${data.id}`,
        ts: Date.parse(data.watch_start),
      });
    },
  },
  hooks: {
    async deploy() {
      const subscriptions = await this.webinargeek.getSubscriptions({
        params: {
          per_page: 10,
          watched_webinar: true,
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
          watched_webinar: true,
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
