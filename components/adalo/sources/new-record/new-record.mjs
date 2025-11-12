import adalo from "../../adalo.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "adalo-new-record",
  name: "New Record",
  description: "Emit new event when is created a record.",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  props: {
    adalo,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(event) {
      this.$emit(event, {
        id: event.id,
        summary: `New record with id ${event.id} created`,
        ts: Date.parse(event.created_at),
      });
    },
  },
  hooks: {
    async deploy() {
      const { records } = await this.adalo.getRecords({
        params: {
          limit: 10,
        },
      });

      records.forEach(this.emitEvent);
    },
  },
  async run({ $ }) {
    let offset = 0;

    while (offset >= 0) {
      const { records } = await this.adalo.getRecords({
        $,
        params: {
          offset,
        },
      });

      records.forEach(this.emitEvent);

      if (records.length < 100) {
        offset = -1;
        return;
      }

      offset += 100;
    }

  },
};
