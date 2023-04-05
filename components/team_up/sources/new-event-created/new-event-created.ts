import app from "../../app/team_up.app";
import { defineSource } from "@pipedream/types";
import {
  ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import { DOCS_LINK } from "../../actions/list-events/list-events";
import { Event } from "../../common/responseSchemas";
import { ListEventsParams } from "../../common/requestParams";

export default defineSource({
  key: "team_up-event-created",
  name: "New Event Created",
  description: `Emit new event for each event created [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "source",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL as number,
      },
    },
  },
  hooks: {
    async deploy() {
      this.setTimestamp(Date.now() / 1000);
    },
  },
  methods: {
    getEntityName(): string {
      return "Created";
    },
    getEventNameOrId({
      id, title,
    }: Event) {
      return title ?? id;
    },
    getTimestamp(): number {
      return this.db.get("timestamp");
    },
    setTimestamp(data: number) {
      this.db.set("timestamp", data);
    },
    emitEvent(data: string) {
      const ts = Date.now();
      this.$emit(data, {
        id: ts + data,
        summary: `New Event ${this.getEntityName()}: "${data}"`,
        ts,
      });
    },
  },
  async run() {
    const { calendarKey } = this;
    const params: ListEventsParams = {
      calendarKey,
      params: {
        modifiedSince: this.getTimestamp()
      },
    };

    const data: Event[] = await this.app.listEvents(params);
    const savedEntities: string[] = this.getSavedEntities() ?? [];
    data.filter((d) => !savedEntities.includes(d)).forEach(this.emitEvent);
    this.setTimestamp(data);
  },
});
