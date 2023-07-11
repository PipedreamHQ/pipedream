import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../uipath_automation_hub.app.mjs";

export default {
  key: "uipath_automation_hub-automation-published",
  name: "New Automation Published",
  version: "0.0.1",
  description: "Emit new event when a new automation is published.",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the UiPath Automation Hub on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults) {
      const lastDate = this._getLastDate() || 0;

      const items = this.app.paginate({
        fn: this.app.listAutomations,
        params: {
          createdStart: lastDate,
          sort: "process_created_epoch",
          sortOrder: "asc",
        },
        maxResults,
      });

      const responseArray = [];
      for await (const item of items) {
        responseArray.push(item);
      }

      responseArray.forEach((item) => {
        this.$emit(
          item,
          {
            id: item.process_id,
            summary: `A automation with Id: "${item.process_id}" was created!`,
            ts: item.process_created_epoch,
          },
        );
      });
      const lastItem = responseArray[responseArray.length - 1];
      if (lastItem?.process_created_epoch) {
        this._setLastDate(lastItem.process_created_epoch);
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
