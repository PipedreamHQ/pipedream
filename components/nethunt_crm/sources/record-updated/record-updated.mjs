import nethuntCrm from "../../nethunt_crm.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "nethunt_crm-record-updated",
  name: "Record Updated",
  description: "Emit new event for every updated record. [See docs here](https://nethunt.com/integration-api#updated-record)",
  version: "0.0.1",
  type: "source",
  props: {
    nethuntCrm,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    folderId: {
      propDefinition: [
        nethuntCrm,
        "folderId",
      ],
    },
  },
  methods: {
    _getSince() {
      return this.db.get("since");
    },
    _setSince(since) {
      this.db.set("since", since);
    },
  },
  async run() {
    const nextSince = new Date();
    const since = this._getSince();

    const records = await this.nethuntCrm.listRecentlyUpdatedRecordsInFolder({
      folderId: this.folderId,
      params: {
        since,
      },
    });

    this._setSince(nextSince);

    for (const record of records) {
      this.$emit(record, {
        id: record.id,
        summary: `Updated record: ${record.fields.Name}`,
        ts: record.updatedAt,
      });
    }
  },
};
