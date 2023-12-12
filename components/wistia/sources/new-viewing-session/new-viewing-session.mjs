import wistia from "../../wistia.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Viewing Session",
  version: "0.0.3",
  key: "wistia-new-viewing-session",
  description: "Emit new event for each new viewing session.",
  type: "source",
  dedupe: "unique",
  props: {
    wistia,
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async emitEvent(data) {
      this.$emit(data, {
        id: data.event_key,
        summary: `New viewing session with id ${data.event_key}`,
        ts: Date.parse(data.received_at),
      });
    },
  },
  hooks: {
    async deploy() {
      const medias = await this.wistia.getViewingSessions({
        params: {
          per_page: 10,
        },
      });

      medias.forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 0;

    while (page >= 0) {
      const medias = await this.wistia.getViewingSessions({
        params: {
          page,
          per_page: 100,
        },
      });

      medias.forEach(this.emitEvent);

      if (medias.length < 100) {
        return;
      }

      page++;
    }
  },
};
