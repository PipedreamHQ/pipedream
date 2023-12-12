import app from "../../calendly_v2.app.mjs";
import sampleEmit from "./test-event.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "calendly_v2-new-event-scheduled",
  name: "New Event Scheduled",
  description: "Emit new event when a event is scheduled.",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      const id = data.uri.split("/").reverse()[0];

      this.$emit(data, {
        id: id,
        summary: `New scheduled event with ID ${id}`,
        ts: Date.parse(data.created_at),
      });
    },
    _setLastResourceId(id) {
      this.db.set("lastResourceId", id);
    },
    _getLastResourceId() {
      return this.db.get("lastResourceId");
    },
  },
  async run() {
    const lastResourceId = this._getLastResourceId();

    let nextPage;

    do {
      const {
        pagination, collection: events,
      } = await this.app.listEvents({
        params: {
          page_token: nextPage,
          count: 100,
          sort: "created_at:desc",
        },
      });

      if (events.length) {
        this._setLastResourceId(events[events.length - 1].uri);

        events.forEach(this.emitEvent);
      }

      if (
        events.length < 100 ||
        events.find(({ uri }) => uri === lastResourceId)
      ) {
        nextPage = null;
        return;
      }

      nextPage = pagination.next_page;
    } while (nextPage);
  },
  sampleEmit,
};
