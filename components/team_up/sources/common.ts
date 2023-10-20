import app from "../app/team_up.app";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { ListEventsParams } from "../common/requestParams";
import {
  Event, EventTimestamps, ListEventsResponse,
} from "../common/responseSchemas";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL as number,
      },
    },
    calendarKey: {
      propDefinition: [
        app,
        "calendarKey",
      ],
    },
  },
  hooks: {
    async deploy() {
      this.setTimestamp(Math.floor(Date.now() / 1000));
    },
  },
  methods: {
    getEntityName(): string {
      return "obtained";
    },
    getFilterField(): keyof EventTimestamps {
      return undefined;
    },
    getTimestamp(): number {
      return this.db.get("timestamp");
    },
    setTimestamp(data: number) {
      this.db.set("timestamp", data);
    },
    emitEvent(data: Event, ts: number) {
      const {
        id, title,
      } = data;
      this.$emit(data, {
        id,
        summary: `New event ${this.getEntityName()}: "${title ?? id}"`,
        ts,
      });
    },
  },
  async run() {
    const { calendarKey } = this;
    const params: ListEventsParams = {
      calendarKey,
      params: {
        modifiedSince: this.getTimestamp(),
      },
    };

    const {
      events, timestamp: ts,
    }: ListEventsResponse =
      await this.app.listEvents(params);

    events
      .filter((ev) => new Date(ev[this.getFilterField()]).valueOf() >= ts)
      .forEach((ev) => this.emitEvent(ev, ts));

    this.setTimestamp(ts);
  },
};
