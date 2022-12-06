import app from "../../siteleaf.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "How often to poll the Siteleaf API for new events",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    setEmittedEvents(emittedEvents) {
      this.db.set("emittedEvents", emittedEvents);
    },
    getEmittedEvents() {
      return this.db.get("emittedEvents") || {};
    },
    async fetchEvents(fetchFunction, ...fetchFunctionParams) {
      let page = 1;
      const emittedEvents = this.getEmittedEvents();
      while (true) {
        const data = await fetchFunction(
          ...fetchFunctionParams,
          page,
        );

        if (data.length === 0) {
          this.setEmittedEvents(emittedEvents);
          return;
        }

        for (const item of data) {
          if (!emittedEvents[item.id]) {
            this.$emit(item, {
              id: item.id,
              summary: item.title || item.basename,
              ts: Date.now(),
            });
            emittedEvents[item.id] = 1;
          }
        }
        page++;
      }
    },
  },
};
