import regfox from "../../regfox.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    regfox,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getLastId() {
      return this.db.get("lastId");
    },
    setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
  },
  async run() {
    let lastId = this.getLastId();
    const data = [];

    while (true) {
      const response = await this.listingFunction()({
        params: {
          startingAfter: lastId,
        },
      });

      data.push(...response.data);
      lastId = data[data.length - 1]?.id;
      this.setLastId(lastId);

      if (!response.hasMore) {
        break;
      }
    }

    data.forEach((event) => this.emitEvent({
      event,
      id: event.id,
      name: event.name,
      ts: event.dateCreated,
    }));
  },
};
