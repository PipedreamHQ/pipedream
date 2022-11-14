import wistia from "../../wistia.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Visitor",
  version: "0.0.2",
  key: "wistia-new-visitor",
  description: "Emit new event for each visitor.",
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
    emitEvent(data) {
      this.$emit(data, {
        id: data.visitor_key,
        summary: `New visitor with id ${data.visitor_key}`,
        ts: Date.parse(data.created_at),
      });
    },
  },
  hooks: {
    async deploy() {
      const medias = await this.wistia.getVisitors({
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
      const medias = await this.wistia.getVisitors({
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
