import gorgias_oauth from "../../gorgias_oauth.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  props: {
    gorgias_oauth,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async processEvent(limit) {
      const { data } = await this.gorgias_oauth.getEvents({
        params: {
          order_by: "created_datetime:desc",
          limit,
          types: this.getEventType(),
        },
      });

      const events = (await Promise.all(
        data.map((event) => this.getEventData(event)),
      )).filter((event) => event !== null);

      for (const event of events.reverse()) {
        this.emitEvent(event);
      }
    },
    emitEvent(event) {
      const ts = Date.parse(event[this.getTsKey()]);
      this.$emit(event, {
        id: `${event.id}_${ts}`,
        ts,
        summary: `New ${this.getEventType()}: ${event.id}`,
      });
    },
    getTsKey() {
      throw new ConfigurationError("getTsKey is not implemented");
    },
    getEventType() {
      throw new ConfigurationError("getEventType is not implemented");
    },
    getEventData() {
      throw new ConfigurationError("getEventData is not implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(constants.HISTORICAL_EVENTS_LIMIT);
    },
  },
  async run() {
    await this.processEvent();
  },
};
