import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "voluum-new-shared-report",
  name: "New Shared Report Created",
  description: "Emit new event when a new shared report is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitEvent() {
      const { sharedReports } = await this.voluum.listSharedReports();
      const lastDate = this._getLastDate();

      const filteredItems = sharedReports
        .filter((item) => Date.parse(item.created) > lastDate)
        .sort((a, b) => Date.parse(b.created) - Date.parse(a.created));

      if (filteredItems.length) {
        this._setLastDate(Date.parse(filteredItems[0].created));
      }

      for (const item of filteredItems.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: `New Shared Report: ${item.id}`,
          ts: Date.parse(item.created),
        });
      }
    },
  },
  sampleEmit,
};
