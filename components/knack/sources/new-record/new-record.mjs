import knack from "../../knack.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "knack-new-record",
  name: "New Record",
  description: "Emit new event for each record created",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    knack,
    objectKey: {
      type: "string",
      label: "Object Key",
      description: "The key of the object which this record belongs to. See [the Knack API docs](https://docs.knack.com/docs/object-based-requests) for more information.",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run({ $ }) {
    const records = await this.knack.getAllRecords($, {
      objectKey: this.objectKey,
    }, {
      rows_per_page: 100,
    }, true);

    for (const record of records) {
      this.$emit(record, {
        id: record.id,
        summary: `New record ${record.id}`,
        ts: new Date(),
      });
    }
  },
};
